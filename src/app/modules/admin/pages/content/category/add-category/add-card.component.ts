import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { fuseAnimations } from '@fuse/animations';
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { ContentCategoryService } from 'app/shared/api/services/contentCategory.service';
import { CategoryListComponent } from '../list-category/list-category.component';

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
        MatInputModule
    ],
     animations: fuseAnimations,
})
export class CategoryAddCardComponent implements OnInit {
    @ViewChild('titleInput') titleInput: ElementRef;
    @ViewChild('titleAutosize') titleAutosize: CdkTextareaAutosize;
    @ViewChild('uploadFileInput') private _uploadFileInput: ElementRef;
    @Input() buttonTitle: string = 'Add a card';
    @Output() readonly saved: EventEmitter<string> = new EventEmitter<string>();
    fileData:any;
    form: UntypedFormGroup;

    /**
     * Constructor
     */
    constructor(
        private _categoryListComponent: CategoryListComponent,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: UntypedFormBuilder,
        private _contentCategoryService: ContentCategoryService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._categoryListComponent.matCategoryDrawer.open();
        // Initialize the new list form
        this.form = this._formBuilder.group({
            name: ['', [Validators.required]],
            workflowName:['', [Validators.required]],
            description:['', [Validators.required]],
            tags:['', [Validators.required]]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Save
     */
    save(): void {

        // Get the new list title
        const name = this.form.get('name').value;
        const workflowName = this.form.get('workflowName').value;
        const description = this.form.get('description').value;
        const tags = [this.form.get('description').value];
        const file =this.fileData;
        // Return, if the title is empty
        if (!name || name.trim() === '') {
            return;
        }

        // Execute the observable
        //this.saved.next(title.trim());

        // Clear the new list title and hide the form
        //this.form.get('name').setValue('');

       this._contentCategoryService.addCategoryContentCategoryAddPostForm(name,workflowName,description,tags,file).subscribe({next:(response)=> {
        console.log(response)
       },error:(error)=>{}})

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._categoryListComponent.matCategoryDrawer.close();
    }

        /**
     * Upload Files
     *
     * @param fileList
     */
    uploadFiles(fileList: FileList): void {
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
        this.fileToBase64(file).then(base64 => {
            this.fileData = base64;
        });
    }

    fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      }

    removeFile(): void {}
    
}
