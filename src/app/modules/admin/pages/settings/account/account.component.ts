import { TextFieldModule } from '@angular/cdk/text-field';
import {
    ChangeDetectionStrategy,
    Component,
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
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SuperAdminService } from 'app/shared/api/services/api';
import { ModelSAInfraIntegration, ModelSAInfraIntegrationUpdate } from 'app/shared/api/model/models';
import { ModelSAUpdateData } from 'app/shared/api/model/models';
import { Subject, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        TextFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        FuseAlertComponent
    ],
})
export class SettingsAccountComponent implements OnInit {
    accountForm: UntypedFormGroup;
    modelSAInfraIntegration: ModelSAInfraIntegration = {
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

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };

    showAlert: boolean = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

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
        this.accountForm = this._formBuilder.group({
            apiurl: new FormControl('', Validators.compose([Validators.required])),
            apikey: new FormControl('', Validators.compose([Validators.required])),
            apihostid: new FormControl('', Validators.compose([Validators.required])),
        });
        this.showAlert = false;
        this.superAdminService.superAdminData$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (superAdminInfraIntegration: ModelSAInfraIntegration) => {
                    if (superAdminInfraIntegration && superAdminInfraIntegration.data) {
                        this.accountForm.setValue({
                            apiurl: superAdminInfraIntegration.data.infra_api_url,
                            apikey: superAdminInfraIntegration.data.infra_api_key,
                            apihostid: superAdminInfraIntegration.data.infra_api_host_id
                        });

                        this.modelSAInfraIntegration = superAdminInfraIntegration;
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
        if (this.modelSAInfraIntegration && this.modelSAInfraIntegration.data) {
            this.accountForm.setValue({
                apiurl: this.modelSAInfraIntegration.data.infra_api_url,
                apikey: this.modelSAInfraIntegration.data.infra_api_key,
                apihostid: this.modelSAInfraIntegration.data.infra_api_host_id
            });
        }
    }

    saveForm(): void {
        if (this.accountForm.invalid) {
            return;
        }

        this.modelSAInfraIntegration.data.infra_api_host_id = this.accountForm.controls.apihostid.value;
        this.modelSAInfraIntegration.data.infra_api_key = this.accountForm.controls.apikey.value;
        this.modelSAInfraIntegration.data.infra_api_url = this.accountForm.controls.apiurl.value;

        // Disable the form
        this.accountForm.disable();

        // Hide the alert
        this.showAlert = false;

        this.modelSAInfraIntegrationUpdate.data = this.modelSAInfraIntegration.data;

        this.superAdminService.updateDataSuperAdminUpdateDataPost(this.modelSAInfraIntegrationUpdate).subscribe({
            next: (response) => {
                // Navigate to the confirmation required page
                this.alert = {
                    type: 'success',
                    message: 'Infra Integration details has been updated.',
                };

                // Show the alert
                this.showAlert = true;

                this.accountForm.enable();
            }, error: (_error) => {
                this.accountForm.enable();

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
