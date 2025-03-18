import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { TextFieldModule } from '@angular/cdk/text-field';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormControl,
    FormGroupDirective,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ContactsService } from 'app/modules/admin/apps/contacts/contacts.service';
import {
    Contact,
    Country,
    Tag,
} from 'app/modules/admin/apps/contacts/contacts.types';
import { ContactsListComponent } from 'app/modules/admin/apps/contacts/list/list.component';
import { UserService } from 'app/shared/api/services/user.service';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { ModelAuthSignup, ModelUserApproveAccess, ModelUserRevokeAccess, ModelUserUpdateRoles } from 'app/shared/api/model/models'
import { AuthService } from 'app/shared/api/services/api'
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';

@Component({
    selector: 'contacts-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    imports: [
        MatButtonModule,
        MatTooltipModule,
        RouterLink,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        TextFieldModule,
        FuseAlertComponent,
    ],
})
export class ContactsDetailsComponent implements OnInit, OnDestroy {
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;
    @ViewChild(FormGroupDirective) formDirective;

    isNewContact = false;
    editMode: boolean = false;
    tags: Tag[];
    tagsEditMode: boolean = false;
    filteredTags: Tag[];
    contact: Contact;
    contactForm: UntypedFormGroup;
    contacts: Contact[];
    countries: Country[];
    roles: Array<string>;
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    modelAuthSignup: ModelAuthSignup = {
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
    };

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsListComponent: ContactsListComponent,
        private _contactsService: ContactsService,
        private _userService: UserService,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _authService: AuthService,
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.showAlert = false;
        // Open the drawer
        this._contactsListComponent.matDrawer.open();

        // Create the contact form
        this.contactForm = this._formBuilder.group({
            _id: [''],
            avatar: [null],
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            roles: this._formBuilder.array([])
        });

        if (this.isNewContact) {
            this.contactForm.get('roles').setValidators(Validators.required);
        }

        this._userService.iseditUserMode$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value: string) => {
            if (this.contact?._id !== value) {
                this.resetForm();
            }
            this.isNewContact = (value == "");
        });

        this.getRecords();
    }

    resetForm() {
        this.contactForm.reset();
        (this.contactForm.get('roles') as UntypedFormArray).clear();
        this.formDirective?.resetForm();
    }

    getRecords() {
        // Get the contacts
        this._userService.contacts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: Contact[]) => {
                this.contacts = contacts;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the contact
        this._userService.contact$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contact: Contact) => {
                // Open the drawer in case it is closed
                this._contactsListComponent.matDrawer.open();
                if (this.isNewContact) {
                    contact = <Contact>{ _id: "", name: "New User", photo: "", email: "", approved: false, revoked: false, verified: false, roles: [] };
                }
                // Get the contact
                this.contact = contact;

                // Patch values to the form
                this.contactForm.patchValue(contact);

                contact.roles.forEach((role) => {
                    const newform = new FormControl(role);

                    (this.contactForm.get('roles') as UntypedFormArray).push(newform);
                })
                // Toggle the edit mode off
                this.toggleEditMode(false);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the country telephone codes
        this._userService.roles$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((roleNames: Array<string>) => {
                this.roles = roleNames;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the country telephone codes
        this._contactsService.countries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((codes: Country[]) => {
                this.countries = codes;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the tags
        this._contactsService.tags$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tags: Tag[]) => {
                this.tags = tags;
                this.filteredTags = tags;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        this.resetForm();
        return this._contactsListComponent.matDrawer.close();
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

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Update the contact
     */
    updateContact(revoked: boolean, approved: boolean, verified: boolean): void {
        // Get the contact object
        const contact = this.contactForm.getRawValue();

        this.modelAuthSignup.email = contact.email;
        this.modelAuthSignup.name = contact.name;
        this.showAlert = false;
        // Create New contact on the server
        if (!this.contact._id && this.contact._id === '') {
            // Hide the alert
            this._authService
                .authSignupAuthSignupPost(this.modelAuthSignup)
                .subscribe({
                    next: (response) => {
                        var message = response.message;

                        // Toggle the edit mode off
                        this.toggleEditMode(false);

                        // Set the alert
                        this.alert = {
                            type: 'success',
                            message: `A verification mail with instructions has been sent to your
                                      email address. Follow those instructions to confirm your email
                                      address and activate your account.`,
                        };

                        // Show the alert
                        this.showAlert = true;

                        this.contact.name = contact.name;
                        this.contact.email = contact.email;
                    }, error: (_error) => {
                        this.toggleEditMode(false);

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
            //return;
        }
        // Revoke User Access
        else if (!revoked && approved) {
            this.revokeAccess(true,true);
        }
        // Approve Revoke User Access
        else if (revoked && verified) {
            const revokeData = <ModelUserApproveAccess>{
                user_id_list: [this.contact._id],
                roles: contact.roles
            };

            this._userService.approveAccessUserAdminApproveAccessPost(revokeData)
                .subscribe({
                    next: (response) => {

                        // Toggle the edit mode off
                        this.toggleEditMode(false);

                        this.alert = {
                            type: 'success',
                            message: `Access has been approved successfully.`,
                        };

                        // Show the alert
                        this.showAlert = true;
                        this.hideAlert();
                        //this.modifiyRoles();
                        this.contact.name = contact.name;
                        this.contact.email = contact.email;
                        this.contact.roles = contact.roles;
                        this.contact.approved = true;
                        this.revokeAccess (false, false);
                    }, error: (_error) => {
                        this.toggleEditMode(false);

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
                        this.hideAlert();
                    }
                });
        }
         // Approving new user access
        else if (verified && !approved && !revoked) {
            const approveUserData = <ModelUserApproveAccess>{
                user_id_list: [this.contact._id],
                roles: contact.roles
            };

            this._userService.approveAccessUserAdminApproveAccessPost(approveUserData)
                .subscribe({
                    next: (response) => {
                        console.log(response);

                        // Toggle the edit mode off
                        this.toggleEditMode(false);

                        this.alert = {
                            type: 'success',
                            message: `Access has been approved successfully.`,
                        };
                        // Show the alert
                        this.showAlert = true;

                        //this.modifiyRoles();

                        this.contact.name = contact.name;
                        this.contact.email = contact.email;
                        this.contact.roles = contact.roles;
                        this.contact.approved = true;
                        this.hideAlert();
                    }, error: (_error) => {
                        this.toggleEditMode(false);

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
                        this.hideAlert();
                    }
                });
        }
    }

    revokeAccess(toMessage:boolean, revoke:boolean) {
        const revokeData = <ModelUserRevokeAccess>{
            user_id_list: [this.contact._id],
            revoke: revoke
        };
        this._userService.revokeAccessUserAdminRevokeAccessPost(revokeData)
                .subscribe({
                    next: (response) => {
                        console.log(response);
                        // Toggle the edit mode off
                        this.toggleEditMode(false);
                        this.showAlert = true;
                         
                        if(toMessage) {
                        this.alert = {
                            type: 'success',
                            message: `Access has been revoked successfully.`,
                        };
                    }
                    this.contact.revoked = revoke;
                        // Show the alert
                      
                        //this.modifiyRoles();
                    }, error: (_error) => {
                        this.toggleEditMode(false);

                        var message = 'Something went wrong, please try again.';

                        if (_error.status === 409 || _error.status === 500 || _error.status === 400) {
                            message = _error?.error['detail'];
                        }

                        if(toMessage) {
                        // Set the alert
                        this.alert = {
                            type: 'error',
                            message: message,
                        };
                    }
                        // Show the alert
                        this.showAlert = true;
                    }
                });
    }

    modifiyRoles() {
        const contact = this.contactForm.getRawValue();
        const updateUserRoles = <ModelUserUpdateRoles>{
            user_id_list: [contact._id],
            roles: contact.roles
        };
        // Show the alert
        this.showAlert = false;
        this._userService.updateRolesUserAdminUpdateRolesPost(updateUserRoles)
            .subscribe({
                next: (response) => {
                    // Toggle the edit mode off
                    this.toggleEditMode(false);
                    console.log(response);
                    this.alert = {
                        type: 'success',
                        message: `User roles has been updated successfully.`,
                    };
                    // Show the alert
                    this.showAlert = true;

                    this.contact.name = contact.name;
                    this.contact.email = contact.email;
                    this.contact.roles = contact.roles;
                    this.hideAlert();
                }, error: (_error) => {
                    // Toggle the edit mode off
                    this.toggleEditMode(false);

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
                    this.hideAlert();
                }
            });
    }

    /**
     * Delete the contact
     */
    deleteContact(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete contact',
            message:
                'Are you sure you want to delete this contact? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the current contact's id
                const id = this.contact.id;

                // Get the next/previous contact's id
                const currentContactIndex = this.contacts.findIndex(
                    (item) => item.id === id
                );
                const nextContactIndex =
                    currentContactIndex +
                    (currentContactIndex === this.contacts.length - 1 ? -1 : 1);
                const nextContactId =
                    this.contacts.length === 1 && this.contacts[0].id === id
                        ? null
                        : this.contacts[nextContactIndex].id;

                // Delete the contact
                this._contactsService
                    .deleteContact(id)
                    .subscribe((isDeleted) => {
                        // Return if the contact wasn't deleted...
                        if (!isDeleted) {
                            return;
                        }

                        // Navigate to the next contact if available
                        if (nextContactId) {
                            this._router.navigate(['../', nextContactId], {
                                relativeTo: this._activatedRoute,
                            });
                        }
                        // Otherwise, navigate to the parent
                        else {
                            this._router.navigate(['../'], {
                                relativeTo: this._activatedRoute,
                            });
                        }

                        // Toggle the edit mode off
                        this.toggleEditMode(false);
                    });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    /**
     * Upload avatar
     *
     * @param fileList
     */
    uploadAvatar(fileList: FileList): void {
        // Return if canceled
        if (!fileList.length) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        if (!allowedTypes.includes(file.type)) {
            return;
        }

        // Upload the avatar
        this._userService.uploadProfilePicUserUploadProfilePicPostForm(file).subscribe();
    }

    /**
     * Remove the avatar
     */
    removeAvatar(): void {
        // Get the form control for 'avatar'
        const avatarFormControl = this.contactForm.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        // Update the contact
        this.contact.avatar = null;
    }

    /**
     * Open tags panel
     */
    openTagsPanel(): void {
        // Create the overlay
        this._tagsPanelOverlayRef = this._overlay.create({
            backdropClass: '',
            hasBackdrop: true,
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay
                .position()
                .flexibleConnectedTo(this._tagsPanelOrigin.nativeElement)
                .withFlexibleDimensions(true)
                .withViewportMargin(64)
                .withLockedPosition(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                ]),
        });

        // Subscribe to the attachments observable
        this._tagsPanelOverlayRef.attachments().subscribe(() => {
            // Add a class to the origin
            this._renderer2.addClass(
                this._tagsPanelOrigin.nativeElement,
                'panel-opened'
            );

            // Focus to the search input once the overlay has been attached
            this._tagsPanelOverlayRef.overlayElement
                .querySelector('input')
                .focus();
        });

        // Create a portal from the template
        const templatePortal = new TemplatePortal(
            this._tagsPanel,
            this._viewContainerRef
        );

        // Attach the portal to the overlay
        this._tagsPanelOverlayRef.attach(templatePortal);

        // Subscribe to the backdrop click
        this._tagsPanelOverlayRef.backdropClick().subscribe(() => {
            // Remove the class from the origin
            this._renderer2.removeClass(
                this._tagsPanelOrigin.nativeElement,
                'panel-opened'
            );

            // If overlay exists and attached...
            if (
                this._tagsPanelOverlayRef &&
                this._tagsPanelOverlayRef.hasAttached()
            ) {
                // Detach it
                this._tagsPanelOverlayRef.detach();

                // Reset the tag filter
                this.filteredTags = this.tags;

                // Toggle the edit mode off
                this.tagsEditMode = false;
            }

            // If template portal exists and attached...
            if (templatePortal && templatePortal.isAttached) {
                // Detach it
                templatePortal.detach();
            }
        });
    }

    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void {
        this.tagsEditMode = !this.tagsEditMode;
    }

    /**
     * Filter tags
     *
     * @param event
     */
    filterTags(event): void {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredTags = this.tags.filter((tag) =>
            tag.title.toLowerCase().includes(value)
        );
    }

    /**
     * Filter tags input key down event
     *
     * @param event
     */
    filterTagsInputKeyDown(event): void {
        // Return if the pressed key is not 'Enter'
        if (event.key !== 'Enter') {
            return;
        }

        // If there is no tag available...
        if (this.filteredTags.length === 0) {
            // Create the tag
            this.createTag(event.target.value);

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }

        // If there is a tag...
        const tag = this.filteredTags[0];
        const isTagApplied = this.contact.tags.find((id) => id === tag.id);

        // If the found tag is already applied to the contact...
        if (isTagApplied) {
            // Remove the tag from the contact
            this.removeTagFromContact(tag);
        } else {
            // Otherwise add the tag to the contact
            this.addTagToContact(tag);
        }
    }

    /**
     * Create a new tag
     *
     * @param title
     */
    createTag(title: string): void {
        const tag = {
            title,
        };

        // Create tag on the server
        this._contactsService.createTag(tag).subscribe((response) => {
            // Add the tag to the contact
            this.addTagToContact(response);
        });
    }

    /**
     * Update the tag title
     *
     * @param tag
     * @param event
     */
    updateTagTitle(tag: Tag, event): void {
        // Update the title on the tag
        tag.title = event.target.value;

        // Update the tag on the server
        this._contactsService
            .updateTag(tag.id, tag)
            .pipe(debounceTime(300))
            .subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Delete the tag
     *
     * @param tag
     */
    deleteTag(tag: Tag): void {
        // Delete the tag from the server
        this._contactsService.deleteTag(tag.id).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add tag to the contact
     *
     * @param tag
     */
    addTagToContact(tag: Tag): void {
        // Add the tag
        this.contact.tags.unshift(tag.id);

        // Update the contact form
        this.contactForm.get('tags').patchValue(this.contact.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove tag from the contact
     *
     * @param tag
     */
    removeTagFromContact(tag: Tag): void {
        // Remove the tag
        this.contact.tags.splice(
            this.contact.tags.findIndex((item) => item === tag.id),
            1
        );

        // Update the contact form
        this.contactForm.get('tags').patchValue(this.contact.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle contact tag
     *
     * @param tag
     */
    toggleContactTag(tag: Tag): void {
        if (this.contact.tags.includes(tag.id)) {
            this.removeTagFromContact(tag);
        } else {
            this.addTagToContact(tag);
        }
    }

    /**
     * Should the create tag button be visible
     *
     * @param inputValue
     */
    shouldShowCreateTagButton(inputValue: string): boolean {
        return !!!(
            inputValue === '' ||
            this.tags.findIndex(
                (tag) => tag.title.toLowerCase() === inputValue.toLowerCase()
            ) > -1
        );
    }

    /**
     * Add the email field
     */
    addEmailField(): void {
        // Create an empty email form group
        const emailFormGroup = this._formBuilder.group({
            email: [''],
            label: [''],
        });

        // Add the email form group to the emails form array
        (this.contactForm.get('emails') as UntypedFormArray).push(
            emailFormGroup
        );

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the email field
     *
     * @param index
     */
    removeEmailField(index: number): void {
        // Get form array for emails
        const emailsFormArray = this.contactForm.get(
            'emails'
        ) as UntypedFormArray;

        // Remove the email field
        emailsFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add an empty phone number field
     */
    addPhoneNumberField(): void {
        // Create an empty phone number form group
        const phoneNumberFormGroup = this._formBuilder.group({
            country: ['us'],
            phoneNumber: [''],
            label: [''],
        });

        // Add the phone number form group to the phoneNumbers form array
        (this.contactForm.get('phoneNumbers') as UntypedFormArray).push(
            phoneNumberFormGroup
        );

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the phone number field
     *
     * @param index
     */
    removePhoneNumberField(index: number): void {
        // Get form array for phone numbers
        const phoneNumbersFormArray = this.contactForm.get(
            'phoneNumbers'
        ) as UntypedFormArray;

        // Remove the phone number field
        phoneNumbersFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Get country info by iso code
     *
     * @param iso
     */
    getCountryByIso(iso: string): Country {
        return this.countries.find((country) => country.iso === iso);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    isRoleChecked(role: string): boolean {
        var rolesList = this.contactForm.get('roles') as UntypedFormArray;
        var index = rolesList.controls.findIndex(x => x.value === role);
        return index !== -1;
    }

    onRoleChanged(isChecked: boolean, role: string) {
        if (isChecked) {
            (
                this.contactForm.get('roles') as UntypedFormArray).push(new FormControl(role));
        }
        else {
            var roleControls = (this.contactForm.get('roles') as UntypedFormArray);
            var index = roleControls.controls.findIndex(x => x.value === role);
            roleControls.removeAt(index);
        }
    }

    hideAlert() {
        setTimeout(() => {
           this.showAlert = false;
           this._changeDetectorRef.markForCheck();
          }, 3000)
    }
}
