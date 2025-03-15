import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
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

import { UserService } from 'app/shared/api/services/user.service';
import { Subject, takeUntil } from 'rxjs';

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
        NgClass,
    ],
})
export class ProfileComponent implements OnInit {

    private _unsubscribeAll: Subject<any> = new Subject<any>();
     user: User;
    /**
     * Constructor
     */
    constructor( private _changeDetectorRef: ChangeDetectorRef,
        private _userService: UserService) {}
   
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
}
