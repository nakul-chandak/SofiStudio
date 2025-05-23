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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/shared/api/services/api'
import { finalize } from 'rxjs';
import { ModelAuthPasswordReset } from 'app/shared/api/model/models'


@Component({
    selector: 'auth-reset-password',
    templateUrl: './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    imports: [
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RouterLink,
    ]
})
export class AuthResetPasswordComponent implements OnInit {
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    resetPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;
    modelAuthPasswordReset: ModelAuthPasswordReset = {
        password: '',
        passwordConfirm: '',
        verificationCode: ''
    };

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.route.queryParams.subscribe(params => {
            this.modelAuthPasswordReset.verificationCode = params['verificationCode'];
        });

        // Create the form
        this.resetPasswordForm = this._formBuilder.group(
            {
                password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
                passwordConfirm: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
            },
            {
                validators: FuseValidators.mustMatch(
                    'password',
                    'passwordConfirm'
                ),
            }
        );

        if (this.modelAuthPasswordReset.verificationCode === undefined || this.modelAuthPasswordReset.verificationCode === '') {
            // Disable the form
            this.resetPasswordForm.disable();

            this.showAlert = true;
            // Set the alert
            this.alert = {
                type: 'error',
                message: 'Invalid Verification Code',
            };
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void {
        // Return if the form is invalid
        if (this.resetPasswordForm.invalid) {
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        this.modelAuthPasswordReset.password = this.resetPasswordForm.controls.password.value;
        this.modelAuthPasswordReset.passwordConfirm = this.resetPasswordForm.controls.passwordConfirm.value;

        if (this.modelAuthPasswordReset.verificationCode !== undefined && this.modelAuthPasswordReset.verificationCode !== '') {
            // Send the request to the server
            this._authService
                .passwordResetAuthPasswordResetPost(this.modelAuthPasswordReset)
                .pipe(
                    finalize(() => {
                        // Re-enable the form
                        this.resetPasswordForm.enable();

                        // Reset the form
                        this.resetPasswordNgForm.resetForm();

                        // Show the alert
                        this.showAlert = true;
                    })
                )
                .subscribe({
                    next: (response) => {
                        // Set the alert
                        this.alert = {
                            type: 'success',
                            message: 'Your password has been reset.',
                        };
                    },
                    error: (_error) => {
                        // Set the alert
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
}
