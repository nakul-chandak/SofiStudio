import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { User } from 'app/core/user/user.types';

import { AuthService, SharedService, UserService } from 'app/shared/api/services/api';
import { Subject, takeUntil } from 'rxjs';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { FormControl, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModelUserUpdateUser } from 'app/shared/api/model/models';
import { CroppedImageProperties, DialogData } from 'app/shared/types/content.types';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ImageContentDialogComponent } from 'app/shared/component/image-dialog/image-dialog.component';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterLink,
        FuseCardComponent,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        TextFieldModule,
        MatDividerModule,
        MatTooltipModule,
        MatDialogModule,
        NgClass,
        FuseAlertComponent,
        ReactiveFormsModule
    ],
})
export class ProfileComponent implements OnInit {
    userForm: UntypedFormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user: User;

    modelUserUpdateUser: ModelUserUpdateUser = {
        name: ''
    };

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };

     readonly dialog = inject(MatDialog);
     
    showAlert: boolean = false;
    editMode: boolean = false;
    fileName:"";
    croppedImage="";
    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder, private _changeDetectorRef: ChangeDetectorRef,
        private _userService: UserService, private sharedService:SharedService, private _authService : AuthService) { }

    ngOnInit(): void {

        // Create the form
        this.userForm = this._formBuilder.group({
            userName: new FormControl('', Validators.compose([Validators.required])),
        });

        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;

                this.userForm.setValue({
                    userName: this.user.name
                });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    updateUserName() {
        if (this.userForm.invalid) {
            return;
        }

        this.modelUserUpdateUser.name = this.userForm.controls.userName.value;

        // Disable the form
        this.userForm.disable();

        // Hide the alert
        this.showAlert = false;

        this._userService.updateUserUserUpdatePost(this.modelUserUpdateUser).subscribe({
            next: (response) => {

                // Navigate to the confirmation required page
                this.alert = {
                    type: 'success',
                    message: 'User Name has been updated.',
                };

                // Show the alert
                this.showAlert = true;

                this.toggleEditMode(false);

                setTimeout(() => {
                    this.showAlert = false;
                    this._changeDetectorRef.markForCheck();
                }, 3000)

            }, error: (_error) => {
                this.userForm.enable();

                var message = 'Something went wrong, please try again.';

                if (_error.status === 409 || _error.status === 500 || _error.status === 403 || _error.status === 422) {
                    message = _error?.error['detail'];
                }

                // Set the alert
                this.alert = {
                    type: 'error',
                    message: message,
                };

                // Show the alert
                this.showAlert = true;
            }
        });
    }

    fileChangeEvent(event: any): void {
        this.fileName = event.target.files[0].name; // Get the file name
        this.croppedImage ='';
        this.openDialog(event);
    }
    
    openDialog(event:Event) {
        const croppedImageProperties =<CroppedImageProperties> {alignImage:"center",aspectRatio:1/1,roundCropper:true}
        this.sharedService.fileDialog = <DialogData>{name : this.fileName, imageEvent:event,imageCropSettings:croppedImageProperties};
        const dialogRef = this.dialog.open(ImageContentDialogComponent,{height:'100%', panelClass:"img-cropper"});
        dialogRef.afterClosed().subscribe((result:DialogData) => {
          if(result) {
            this.user.avatar = result?.tempUrl;
            // call to save profile Image
            this.uploadAvatar(result?.file);
            this._changeDetectorRef.markForCheck();
          }
        });
      }


    /**
     * Upload avatar
     *
     * @param fileList
     */
    uploadAvatar(imageFile: File): void {
        // Return if canceled
        if (!imageFile) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];

        // Return if the file is not allowed
        if (!allowedTypes.includes(imageFile.type)) {
            return;
        }

        // Upload the avatar
        this._userService.uploadProfilePicUserUploadProfilePicPostForm(imageFile)
            .subscribe({
                next: (response) => {
                    this.user.avatar = this.getImage(response.url);
                    this._authService.setUserData();
                    //this.contact.photo = response.url;
                    this.alert = {
                        type: 'success',
                        message: `Profile picture has been updated successfully.`,
                    };
                    // Show the alert
                    this.showAlert = true;

                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                }, error: (_error) => {
                    var message = 'Something went wrong, please try again.';

                    if (_error.status === 409 || _error.status === 500 || _error.status === 400) {
                        message = _error?.error['detail'];
                    }

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: message,
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            });
    }


    getImage(url: string) {
        return url ? `${url}?v=${new Date().getTime()}` : "";
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
        }

        if (editMode) {
            this.userForm.setValue({
                userName: this.user.name
            });
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the avatar
     */
    removeAvatar(): void {
        // Get the form control for 'avatar'
        //const avatarFormControl = this.contactForm.get('avatar');

        // Set the avatar as null
        //avatarFormControl.setValue(null);

        // Set the file input value as null
        //this._avatarFileInput.nativeElement.value = null;

        // Update the contact
        //this.contact.avatar = null;
    }
}
