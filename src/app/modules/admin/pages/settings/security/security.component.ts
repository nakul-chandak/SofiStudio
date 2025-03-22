import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { ModelSAInfraIntegrationUpdate, ModelSAUXIntegration } from 'app/shared/api/model/models';
import { SuperAdminService } from 'app/shared/api/services/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'settings-security',
    templateUrl: './security.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatButtonModule,
        FuseAlertComponent
    ],
})
export class SettingsSecurityComponent implements OnInit, OnDestroy {
    securityForm: UntypedFormGroup;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };

    showAlert: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    modelSAUXIntegration: ModelSAUXIntegration = {
        createDatetime: undefined,
        createdBy: '',
        data: undefined,
        updateDatetime: undefined,
        updatedBy: '',
        _id: ''
    };

    modelSAInfraIntegrationUpdate: ModelSAInfraIntegrationUpdate = {
        data: undefined
    };

    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder, private superAdminService: SuperAdminService) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.securityForm = this._formBuilder.group({
            homeLink: new FormControl('', Validators.compose([Validators.required])),
            verifyEmailLink: new FormControl('', Validators.compose([Validators.required])),
            resetPasswordLink: new FormControl('', Validators.compose([Validators.required])),
        });

        this.showAlert = false;

        this.superAdminService.superAdminUXData$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (superAdminUXIntegration: ModelSAUXIntegration) => {
                    if (superAdminUXIntegration && superAdminUXIntegration.data) {
                        this.securityForm.setValue({
                            homeLink: superAdminUXIntegration.data.ux_link_home,
                            verifyEmailLink: superAdminUXIntegration.data.ux_link_verify_email,
                            resetPasswordLink: superAdminUXIntegration.data.ux_link_reset_pw
                        });

                        this.modelSAUXIntegration = superAdminUXIntegration;
                    }
                }, error: (_error) => {
                    var message = 'Something went wrong, please try again.';

                    if (_error.status === 409 || _error.status === 500 || _error.status === 400 || _error.status === 403) {
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

    /**
    * On destroy
    */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    resetForm(): void {
        if (this.modelSAUXIntegration && this.modelSAUXIntegration.data) {
            this.securityForm.setValue({
                homeLink: this.modelSAUXIntegration.data.ux_link_home,
                verifyEmailLink: this.modelSAUXIntegration.data.ux_link_verify_email,
                resetPasswordLink: this.modelSAUXIntegration.data.ux_link_reset_pw
            });
        }
    }

    saveForm(): void {
        if (this.securityForm.invalid) {
            return;
        }

        this.modelSAUXIntegration.data.ux_link_home = this.securityForm.controls.homeLink.value;
        this.modelSAUXIntegration.data.ux_link_verify_email = this.securityForm.controls.verifyEmailLink.value;
        this.modelSAUXIntegration.data.ux_link_reset_pw = this.securityForm.controls.resetPasswordLink.value;

        // Disable the form
        this.securityForm.disable();

        // Hide the alert
        this.showAlert = false;

        this.modelSAInfraIntegrationUpdate.data = this.modelSAUXIntegration.data;

        this.superAdminService.updateDataSuperAdminUpdateDataPost(this.modelSAInfraIntegrationUpdate).subscribe({
            next: (response) => {
                // Navigate to the confirmation required page
                this.alert = {
                    type: 'success',
                    message: 'UX Integration details has been updated.',
                };

                // Show the alert
                this.showAlert = true;

                this.securityForm.enable();
            }, error: (_error) => {
                this.securityForm.enable();

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
}
