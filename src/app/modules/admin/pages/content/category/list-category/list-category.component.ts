import { CdkScrollable } from '@angular/cdk/scrolling';

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    Pipe, PipeTransform,
    inject
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink, RouterOutlet, RouterModule } from '@angular/router';

import { DateTime } from 'luxon';
import { Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { ContentService } from '../../content.service';
import { Board } from '../../content.models';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseCardComponent } from '@fuse/components/card';
import { MatButtonModule } from '@angular/material/button';
import { Category, ModelContentCategoryDelete } from 'app/shared/api/model/models';
import { ContentCategoryService, SharedService } from 'app/shared/api/services/api';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseAlertType } from '@fuse/components/alert/alert.types';
import { FuseAlertComponent } from '@fuse/components/alert';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/shared/component/confirm-dialog/confirm-dialog.component';
import { ConfirmDialog } from 'app/shared/types';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';


@Component({
    selector: 'list-category',
    templateUrl: './list-category.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CdkScrollable,
        MatIconModule,
        MatSidenavModule,
        RouterOutlet,
        FuseCardComponent,
        MatButtonModule,
        AsyncPipe,
        CommonModule,
        MatTooltipModule,
        FuseAlertComponent,
        RouterModule,
        MatDialogModule,
        MatMenuModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        DatePipe 
    ],
})
export class CategoryListComponent implements OnInit, OnDestroy {
    @ViewChild('matCategoryDrawer', { static: true }) matCategoryDrawer: MatDrawer;
    readonly dialog = inject(MatDialog);
    readonly sharedService = inject(SharedService);
    boards: Board[];
    categories:Category[];
    categories$:Observable<Category[]>;
    drawerMode: 'side' | 'over';
    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();

      alert: { type: FuseAlertType; message: string } = {
            type: 'success',
            message: '',
        };
    
    showAlert = false;
   searchInputControl: UntypedFormControl = new UntypedFormControl();
   categoriesCount = 0;
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _contentService: ContentService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _contentCategoryService:ContentCategoryService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the boards
        this._contentService.boards$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((boards: Board[]) => {
                this.boards = boards;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

            // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(({ matchingAliases }) => {
            // Set the drawerMode if the given breakpoint is active
            if (matchingAliases.includes('lg')) {
                this.drawerMode = 'side';
            } else {
                this.drawerMode = 'over';
            }

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // Get List of categories

          this.categories$ = this._contentCategoryService.categories$;
                this._contentCategoryService.categories$
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((categories: Category[]) => {
                        this.categoriesCount = categories.length;
                        // Mark for check
                        this._changeDetectorRef.markForCheck();
                    });


         // Subscribe to MatDrawer opened change
         this.matCategoryDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                this.updateList();
                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

          // Subscribe to search input field value changes
                this.searchInputControl.valueChanges
                    .pipe(
                        takeUntil(this._unsubscribeAll),
                        switchMap((query) =>
                            // Search
                            this._contentCategoryService.searchCategoriesContentCategorySearchGet(query)
                        )
                    )
                    .subscribe();
    }

    updateList() {
        this._contentCategoryService.listAllCategoriesContentCategoryListAllGet().subscribe();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Format the given ISO_8601 date as a relative date
     *
     * @param date
     */
    formatDateAsRelative(date: string): string {
        return DateTime.fromISO(date).toRelative();
    }

    AddNewCategory() {
        this._contentCategoryService.setCategoryId = "";
         const id="00000000-0000-0000-0000-000000000000";
             this._router.navigate([`./new/${id}`], {
                relativeTo: this._activatedRoute,
            });
    }

    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Edit category
     * @param id 
     */
    editCategory(id:string) {
        const params = window.location.pathname.split('/');
        const length =  params?.length;
        var editId = params[length - 1];
       if(editId !== id) {
        this._contentCategoryService.setCategoryId = id;
        this._router.navigate([`./edit/${id}`], {
            relativeTo: this._activatedRoute,
        });

         // Mark for check
         this._changeDetectorRef.markForCheck();
     }  
    }

    removeCategory(id: string) {
        this.sharedService.confirmDialog = <ConfirmDialog>{
            cancelButtonLabel: "Cancel",
            confirmButtonLabel: "Delete",
            message: "Do you really want to delete?",
            title: "Are you sure?"
        };
        const dialogRef = this.dialog.open(ConfirmDialogComponent);
        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                const deleteCategoryModel = <ModelContentCategoryDelete>{ id: id };
                this._contentCategoryService.deleteCategoryContentCategoryDeletePost(deleteCategoryModel).subscribe({
                    next: (response) => {
                        if (response.status.toLocaleLowerCase() === "success") {
                            // Set the alert
                            this.alert = {
                                type: 'success',
                                message: `Category has been removed successfuly.`,
                            };
                            // Show the alert
                            this.showAlert = true;
                            // Mark for check
                            this.hideAlert();
                            this.updateList();
                        }
                    },
                    error: (error) => {
                        this.showError(error);
                    }
                });
            }
        })
    }

    
    /**
     * append unique value against url to reflect image on UI after update.
     * @param url 
     * @returns 
     */
    getImage(url:string) {
        return url ? `${url}?v=${new Date().getTime()}`: "";
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item._id || index;
    }

    hideAlert() {
        setTimeout(() => {
            this.showAlert = false;
            this._changeDetectorRef.markForCheck();
        }, 2000)
    }
    
    showError(_error:any){
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
}
