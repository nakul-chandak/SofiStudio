import { AsyncPipe, DOCUMENT, I18nPluralPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import {
    ActivatedRoute,
    Router,
    RouterLink,
    RouterOutlet,
} from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ContactsService } from 'app/modules/admin/apps/contacts/contacts.service';
import { UserService } from 'app/shared/api/services/api';
import {
    Contact,
    Country,
} from 'app/modules/admin/apps/contacts/contacts.types';
import {
    BehaviorSubject,
    Observable,
    Subject,
    filter,
    fromEvent,
    of,
    switchMap,
    takeUntil,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { MatMenuModule } from '@angular/material/menu';
import { ModelUserApproveAccess, ModelUserRevokeAccess } from 'app/shared/api/model/models';

@Component({
    selector: 'contacts-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    imports: [
        MatSidenavModule,
        RouterOutlet,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        NgClass,
        AsyncPipe,
        I18nPluralPipe,
        MatCheckboxModule,
        FuseAlertComponent
    ],
})
export class ContactsListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };

    showAlert: boolean = false;
    contacts$: Observable<Contact[]>;

    contactsCount: number = 0;
    contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    countries: Country[];
    drawerMode: 'side' | 'over';
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedContact: Contact;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    indeterminate = false;
    selectAllContacts = false;
    isEventTriggred = false;
    roleList:Array<any> =[];
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsService: ContactsService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _userService: UserService
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.getConactData();
        // Get the countries
        this._contactsService.countries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((countries: Country[]) => {
                // Update the countries
                this.countries = countries;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap((query) =>
                    // Search
                    this._userService.searchUsersUserAdminSearchUsersGet(query)
                )
            )
            .subscribe();

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                if (!this.isEventTriggred) {
                    this.searchInputControl.setValue('');
                }

                this.isEventTriggred = true;
                // Search
                //this.ngOnInit();
                // ct when drawer closed
                this.selectedContact = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
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

        // Listen for shortcuts
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(
                    (event) =>
                        (event.ctrlKey === true || event.metaKey) && // Ctrl or Cmd
                        event.key === '/' // '/'
                )
            )
            .subscribe(() => {
                this.createContact();
            });
    }

    getConactData() {
        // Get the contacts
        this.contacts$ = this._userService.contacts$;

        this._userService.contacts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: Contact[]) => {
                // Update the counts
                this.contactsCount = contacts.length;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the contact
        this._userService.contact$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contact: Contact) => {
                // Update the selected contact
                this.selectedContact = contact;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

            // Get the contact
        this._userService.roles$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((roles: Array<string>) => {
            // Update the selected contact
            roles.map((role)=> {
                this.roleList.push({name:role,isSelected:false});
            });

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
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Create contact
     */
    createContact(): void {
        this._userService.iseditUserMode = "";
        this._router.navigate(['./', ""], {
            relativeTo: this._activatedRoute,
        });
        // Create the contact
        this._changeDetectorRef.markForCheck();
    }

    /**
  * Create contact
  */
    editContact(id: string): void {
        this._userService.iseditUserMode = id;
        this._router.navigate(['./', id], {
            relativeTo: this._activatedRoute,
        });
        this.isEventTriggred = false;
        this.update(false);
        this._changeDetectorRef.markForCheck();
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

    /**
     * Modify contacts
     */
    bulkActions() {
        // this.contacts$.subscribe((contacts: Contact[]) => {
        //     const selectedConacts = contacts.filter((contact) => contact.isBulkSelect);
        //     this._router.navigate(['./bulk-update'], {
        //         relativeTo: this._activatedRoute,
        //         state: selectedConacts
        //     });
        //     // Mark for check
          //  this._changeDetectorRef.markForCheck();
        //});
    }

    /**
     * Select all and partially select
     * @param completed 
     * @param contact 
     */
    update(completed: boolean, contact?: Contact) {
        var isManualTrigger = true;
        if (contact === undefined) {
            this.indeterminate = false;
            this.contacts$.subscribe((contacts: Contact[]) => {
                if(isManualTrigger) {
                    isManualTrigger =false;
                contacts.forEach(x => (x.isBulkSelect = completed));
                this.selectAllContacts = completed;
                }
            });
        }
        else {
            contact.isBulkSelect = completed;
            this.contacts$.subscribe((contacts: Contact[]) => {
                if(isManualTrigger) {
                    isManualTrigger =false;
                    this.selectAllContacts = contacts?.every(x => (x.isBulkSelect)) ?? true;
                    this.indeterminate = contacts?.some(x => (x.isBulkSelect)) && !contacts?.every(x => (x.isBulkSelect));
                }
            });
        }
    }

    /**
     * Approve and Revoke user access
     * @param isRevoke is true means revoke user access and if false means approve user access
     */
   bulkUserRevoke(isRevoke:boolean) {
    var isManualTrigger = true;

    this.contacts$.subscribe((contacts: Contact[]) => {
       const totalSelectedUsersCount =contacts.filter(x => x.isBulkSelect).length;
       const selecteduserList = isRevoke ? contacts.filter(x => x.isBulkSelect && x.verified && !x.revoked).map(x=>x._id):
                                 contacts.filter(x => x.isBulkSelect && x.verified && x.revoked).map(x=>x._id)
     
         // bulk user Approve
        const revokeData = <ModelUserRevokeAccess>{
                user_id_list: selecteduserList,
                revoke: isRevoke  // isRovoke = true means set revoke falg false.
            };
    
        if(selecteduserList?.length > 0 && isManualTrigger) {
            isManualTrigger = false;
    this._userService.revokeAccessUserAdminRevokeAccessPost(revokeData)
    .subscribe({
        next: (response) => {
            const msg= isRevoke ? "revoked" : "approved"
            const userPuralOrSingular = totalSelectedUsersCount > 1 ? "users" : "user";
            const userVal = selecteduserList.length > 1 ? "users" : "user";
            this.alert = {
                type: 'success',
                message: `Out of the selected ${totalSelectedUsersCount } ${userVal}, access has been ${msg} for ${selecteduserList.length} ${userPuralOrSingular}. The access for the remaining users is already approved.`,
            };
            // Show the alert
            this.showAlert = true;
            this.searchInputControl.setValue('');
            this.hideAlert();
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
            this.hideAlert();
              }
            });
          }
          else if(isManualTrigger) {
            isManualTrigger = false;
            // Set the alert
            this.alert = {
                type: 'success',
                message: "The access for the selected users has already been approved.",
            };

            // Show the alert
            this.showAlert = true;
            this.hideAlert();
            }
        });
    }

    bulkUserReinstead() {
        var isManualTrigger = true;
        this.contacts$.subscribe((contacts: Contact[]) => {
             const totalSelectedUsersCount = contacts.filter(x => x.isBulkSelect).length;
            const selecteduserList = contacts.filter(x => x.isBulkSelect && x.verified && x.revoked && x.approved).map(x => x._id);
          
            // bulk user Approve
            const revokeData = <ModelUserRevokeAccess>{
                user_id_list: selecteduserList,
                revoke: false
            };

            if (selecteduserList?.length > 0 && isManualTrigger) {
                isManualTrigger = false;
                this._userService.revokeAccessUserAdminRevokeAccessPost(revokeData).subscribe({
                        next: (response) => {
                            const userPuralOrSingular = totalSelectedUsersCount > 1 ? "users" : "user";
                            const userVal = selecteduserList.length > 1 ? "users" : "user";
                            this.alert = {
                                type: 'success',
                                message: `Out of the selected ${selecteduserList.length} ${userVal}, access has been Reinstead for ${selecteduserList.length} ${userPuralOrSingular}. The access for the remaining users is already Reinstead.`,
                            };
                            // Show the alert
                            this.showAlert = true;
                            this.searchInputControl.setValue('');
                            this.hideAlert();
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
                            this.hideAlert();
                        }
                    });
                }
            else if(isManualTrigger) {
                isManualTrigger = false;
                // Set the alert
                this.alert = {
                    type: 'success',
                    message: "The access for the selected users has already been Reinstead.",
                };

                // Show the alert
                this.showAlert = true;
                this.hideAlert();
            }
        });
    }

    updateRoles(checked:boolean,roleName:string) {    
      this.roleList.filter(x=>x.name === roleName).map(x=>x.isSelected=checked);
    }

    setRoles(checked:boolean) {
        this.roleList.map(x => x.isSelected = checked);
        this._changeDetectorRef.markForCheck();
    }

    bulkUpdateRoles() {
        var isTrigger = true;
        const selectedRoles = this.roleList.filter(x => x.isSelected).map(x=>x.name);
        this.contacts$.subscribe((contacts: Contact[]) => {
            if (isTrigger) {
                const selectedContacts = contacts.filter(x => x.isBulkSelect).map(x=>x._id);

                // trigger API call
                console.log(selectedRoles);
                console.log(selectedContacts);

                // after successful
                this.setRoles(false);
            }
        });
    }

    hideAlert() {
        setTimeout(() => {
           this.showAlert = false;
           this._changeDetectorRef.markForCheck();
          }, 3000)
    }
}
