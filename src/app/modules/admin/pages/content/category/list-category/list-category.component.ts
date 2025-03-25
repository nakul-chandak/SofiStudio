import { CdkScrollable } from '@angular/cdk/scrolling';

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';

import { DateTime } from 'luxon';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ContentService } from '../../content.service';
import { Board } from '../../content.models';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseCardComponent } from '@fuse/components/card';
import { MatButtonModule } from '@angular/material/button';
import { Category } from 'app/shared/api/model/models';
import { ContentCategoryService } from 'app/shared/api/services/api';
import { AsyncPipe } from '@angular/common';


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
        AsyncPipe
    ],
})
export class CategoryListComponent implements OnInit, OnDestroy {
    @ViewChild('matCategoryDrawer', { static: true }) matCategoryDrawer: MatDrawer;

    boards: Board[];
    categories:Category[];
    categories$:Observable<Category[]>;
    drawerMode: 'side' | 'over';
    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();

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
                    .subscribe((contacts: Category[]) => {
                        // Mark for check
                        this._changeDetectorRef.markForCheck();
                    });


         // Subscribe to MatDrawer opened change
         this.matCategoryDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                this._contentCategoryService.listAllCategoriesContentCategoryListAllGet().subscribe();
                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });
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
        this._contentCategoryService.setCategoryId = id;
        this._router.navigate([`./edit/${id}`], {
            relativeTo: this._activatedRoute,
        });
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
}
