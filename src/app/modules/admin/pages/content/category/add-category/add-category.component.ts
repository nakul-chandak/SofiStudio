import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormGroupDirective,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { ContentCategoryListComponent } from '../list-category/list-category.component';
import { Category } from 'app/shared/api/model/models';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { Subject, takeUntil } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ContentCategoryService,SharedService } from 'app/shared/api/services/api';
import { DialogData } from '../../content.types';
import { ImageContentDialogComponent } from '../dialog/image-dialog/image-dialog.component';

@Component({
    selector: 'add-category',
    templateUrl: './add-category.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatButtonModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        TextFieldModule,
        RouterLink,
        MatTooltip,
        MatInputModule,
        MatCheckboxModule,
        MatDialogModule,
        FuseAlertComponent
    ],
    animations: fuseAnimations,
})
export class ContentCategoryAddCardComponent implements OnInit, OnDestroy {
    @ViewChild('titleInput') titleInput: ElementRef;
    @ViewChild('titleAutosize') titleAutosize: CdkTextareaAutosize;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;
    @ViewChild(FormGroupDirective) formDirective;

    @Input() buttonTitle: string = 'Add a card';
    @Output() readonly saved: EventEmitter<string> = new EventEmitter<string>();
    readonly dialog = inject(MatDialog);
    
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    categoryForm: UntypedFormGroup;
    croppedImage: SafeUrl  = '';
    file: File;
    editMode = false;
    category = <Category>{
        name: "",
        description: "",
        tags: [],
        workflowName: "",
        photo: ""
    };
    tags: Array<string> = [];;
    tagsEditMode: boolean = false;
    filteredTags: Array<string> = [];
    showAlert: boolean = false;
    categoryId = "";
    isFormEditMode = false;
    fileName="dummy";
    /**
     * Constructor
     */
    constructor(
        private _categoryListComponent: ContentCategoryListComponent,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: UntypedFormBuilder,
        private _contentCategoryService: ContentCategoryService,
        private _renderer2: Renderer2,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _router: Router,
        private route: ActivatedRoute,
        private sharedService:SharedService
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._categoryListComponent.matCategoryDrawer.open();

        this.route.paramMap.subscribe(params => {
            this.categoryId = params.get('id');
          });

        // Initialize the new list form
        this.categoryForm = this._formBuilder.group({
            name: ['', [Validators.required]],
            workflowName: ['', [Validators.required]],
            description: ['', [Validators.required]],
            tags: []
        });

        this._contentCategoryService.getCategoryId$.subscribe((value)=> {
            if(value === "" || value =="00000000-0000-0000-0000-000000000000") {
                this._changeDetectorRef.markForCheck();
            }
        })

        this._contentCategoryService.category$.pipe(takeUntil(this._unsubscribeAll))
            .subscribe((cate) => {
                    if(!this._categoryListComponent.matCategoryDrawer.opened)
                        {
                            this._categoryListComponent.matCategoryDrawer.open();
                        }
                           // this.resetForm();
                           if(this.categoryId != "00000000-0000-0000-0000-000000000000") {
                            this.isFormEditMode = true;
                            this.category = cate;
                            this.categoryForm.patchValue(cate);
                            if (this.category) {
                                const tages = this.separateStringIntoArray(this.category.tags);
                                this.category.tags = tages;
                                this.filteredTags = this.tags = tages;
                                // Toggle the edit mode off
                                this.toggleEditMode(false);
                            }
                        }
            });
    }  

    separateStringIntoArray(stringArray) {
        if (!Array.isArray(stringArray) || stringArray.length === 0) {
            return []; // Return empty array for invalid input
        }

        const result = [];
        for (const str of stringArray) {
            result.push(...str.split(',')); //spread the split array into the result array
        }
        return result;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Save
     */
    save(): void {
        // Get the new list title
        const formdata = new FormData();
        formdata.append("name", this.categoryForm.get('name').value);
        formdata.append("workflowName", this.categoryForm.get('workflowName').value);
        formdata.append("description", this.categoryForm.get('description').value);
        const tags = [this.categoryForm.get('tags').value];
        tags.forEach((tag) => {
            formdata.append("tags", tag);
        });

        if (this.file) {
            formdata.append("file", this.file, this.file.name);
        }

        if (this.isFormEditMode) {
            formdata.append("id", this.categoryId);
            this.update(formdata)
            return;
        }

        this._contentCategoryService.addCategoryContentCategoryAddPostForm(formdata).subscribe({
            next: (response) => {
                if (response.status.toLocaleLowerCase() === "success") {
                    // Set the alert
                    this.alert = {
                        type: 'success',
                        message: `New category has been added successfuly.`,
                    };
                    // Show the alert
                    this.showAlert = true;
                    this.resetForm();
                    // Mark for check
                    this._changeDetectorRef.markForCheck();

                    // close drawer aftwe add category
                    setTimeout(() => {
                        // Go back to the list
                        this._router.navigate(['/category'], { relativeTo: this.route });
                        this.closeDrawer();
                    }, 2000);

                }
            }, error: (error) => { this.showError(error); }
        })

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

     /**
     * Update card
     * @param formData 
     */
    async update(formData: FormData): Promise<void> {
        this._contentCategoryService.updateCategoryContentCategoryUpdatePostForm(formData).subscribe({
            next: (response) => {
                if (response.status.toLocaleLowerCase() === "success") {
                    // Set the alert
                    this.alert = {
                        type: 'success',
                        message: `category has been updated successfuly.`,
                    };
                    // Show the alert
                    this.showAlert = true;
                    this.resetForm();

                    // close drawer aftwe add category
                    setTimeout(() => {
                        // Go back to the list
                        this._router.navigate(['/category'], { relativeTo: this.route });
                        this.closeDrawer();
                    }, 2000);
                    this._changeDetectorRef.markForCheck();
                }
            }, error: (error) => { this.showError(error); }
        })

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._categoryListComponent.matCategoryDrawer.close();
    }

    redirecttoCategory(){
         // Go back to the list
         //this.resetForm();
         this._router.navigate(['/category'], { relativeTo: this.route });
         this.closeDrawer();
    }

    /**
     * reset form
     */
    resetForm() {
        this.categoryForm.reset();
        this.formDirective?.resetForm();
        this.category = <Category>{
            name: "",
            description: "",
            tags: [],
            workflowName: "",
            photo: ""
        };
        this.file = null;
        this.tags = this.filteredTags = [];
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    removeFile(): void { 
        this.croppedImage = '';
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
    * Toggle contact tag
    *
    * @param tag
    */
    toggleTag(tag: string): void {
        if (this.category.tags.includes(tag)) {
            this.removeTag(tag);
        } else {
            this.addTag(tag);
        }
    }

    /**
 * Remove tag from the contact
 *
 * @param tag
 */
    removeTag(tag: string): void {
        // Remove the tag
        this.category.tags.splice(
            this.category.tags.findIndex((item) => item === tag),
            1
        );

        // Update the contact form
        this.categoryForm.get('tags').patchValue(this.category.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
    * Add tag to the contact
    *
    * @param tag
    */
    addTag(tag: string): void {
        // Add the tag
        this.category.tags.unshift(tag);

        // Update the contact form
        this.categoryForm.get('tags').patchValue(this.category.tags);
        this.filteredTags = this.tags = this.category.tags;
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
  * Toggle the tags edit mode
  */
    toggleTagsEditMode(): void {
        this.tagsEditMode = !this.tagsEditMode;
    }

    /**
   * Delete the tag
   *
   * @param tag
   */
    deleteTag(tag: string): void {
        // Delete the tag from the server

        // remove from list

        // Mark for check
        this._changeDetectorRef.markForCheck();
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
            tag.toLowerCase().includes(value)
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
            this.addTag(event.target.value);

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }

        // If there is a tag...
        const filterTag = this.filteredTags[0];
        const isTagApplied = this.category.tags.find((tag) => tag === filterTag);

        // If the found tag is already applied to the contact...
        if (isTagApplied) {
            // Remove the tag from the contact
            this.removeTag(filterTag);
        } else {
            // Otherwise add the tag to the contact
            this.addTag(filterTag);
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
                (tag) => tag.toLowerCase() === inputValue.toLowerCase()
            ) > -1
        );
    }

    /**
    * Track by function for ngFor loops
    *
    * @param index
    * @param item
    */
    trackByFn(index: number, item: any): any {
        return item || index;
    }

    /**
     * show error on page as alert
     * @param _error 
     */
    showError(_error: any) {
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

    /**
     * hide alert message after 3 sec
     */
    hideAlert() {
        setTimeout(() => {
            this.showAlert = false;
            this._changeDetectorRef.markForCheck();
        }, 3000)
    }


    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    fileChangeEvent(event: any): void {
        this.fileName = event.target.files[0].name; // Get the file name
        this.croppedImage ='';
        this.openDialog(event);
    }

    openDialog(event:Event) {
        this.sharedService.fileDialog = <DialogData>{name : this.fileName, imageEvent:event};
        const dialogRef = this.dialog.open(ImageContentDialogComponent,{height:'100%', panelClass:"img-cropper"});
        dialogRef.afterClosed().subscribe((result:DialogData) => {
          if(result) {
            this.croppedImage = result?.tempUrl;
            this.file = result?.file;
            this._changeDetectorRef.markForCheck();
          }
        });
      }
}
