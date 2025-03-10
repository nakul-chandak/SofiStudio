import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/shared/api/services/api'
import { finalize } from 'rxjs';
import { ModelAuthPasswordResetRequest } from 'app/shared/api/model/models'

@Component({
    selector: 'auth-forgot-password',
    templateUrl: './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    imports: [
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        RouterLink,
    ]
})
export class AuthForgotPasswordComponent implements OnInit {
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    forgotPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;
    modelAuthPasswordResetRequest: ModelAuthPasswordResetRequest = {
        email: ''
    };

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Send the reset link
     */
    sendResetLink(): void {
        // Return if the form is invalid
        if (this.forgotPasswordForm.invalid) {
            return;
        }

        // Disable the form
        this.forgotPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        this.modelAuthPasswordResetRequest.email = this.forgotPasswordForm.controls.email.value;

        // Forgot password
        this._authService.passwordResetRequestAuthPasswordResetRequestPost(this.modelAuthPasswordResetRequest)
        .pipe(
            finalize(() => {
                // Re-enable the form
                this.forgotPasswordForm.enable();

                // Reset the form
                this.forgotPasswordNgForm.resetForm();

                // Show the alert
                this.showAlert = true;
            })
        )
        .subscribe({
            next: (response) => { 
                // Set the alert
                this.alert = {
                    type: 'success',
                    message:
                        "Password reset sent! You'll receive an email if you are registered on our system.",
                };

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
            }
        });
    }
}
