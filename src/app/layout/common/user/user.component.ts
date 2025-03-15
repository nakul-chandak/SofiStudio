import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { UserService } from 'app/shared/api/services/user.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';
import { ModelUserUpdateStatus } from 'app/shared/api/model/models';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user',
    imports: [
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        NgClass,
        MatDividerModule,
        FuseAlertComponent
    ],
})
export class UserComponent implements OnInit, OnDestroy {
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    user: User;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

        alert: { type: FuseAlertType; message: string } = {
            type: 'success',
            message: '',
        };
        showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;

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
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user status
     *
     * @param status
     */
    updateUserStatus(status: string): void {
        // Return if user is not available
        if (!this.user) {
            return;
        }
        
        const statusModel =<ModelUserUpdateStatus>{
            onlineStatus:status
        }
        //Update the user
        this._userService.updateStatusUserUpdateStatusPost(statusModel).subscribe({next:(response)=>{
            this.showAlert = true;
            this.alert = {
                type: 'success',
                message: `User status has been updated successfully.`,
            };
        },error:(_error)=>{
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
        }});
    }

    /**
     * Sign out
     */
    signOut(): void {
        this._router.navigate(['/sign-out']);
    }

    /**
     * profile
     */
    profile(): void {
        this._router.navigate(['/profile']);
    }
}
