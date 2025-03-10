import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
//import { AuthService } from 'app/core/auth/auth.service';
import { ModelAuthSignup } from 'app/shared/api/model/models'
import { AuthService } from 'app/shared/api/services/api'

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    imports: [
        RouterLink,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
    ]
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;

    modelAuthSignup: ModelAuthSignup = {
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
    };

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        public formBuilder: FormBuilder
    ) {
        this.signUpForm = this.formBuilder.group({
            name: new FormControl('', Validators.compose([Validators.required])),
            email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
            password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(30),  Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])),
            confirmpassword: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(30),  Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])),
            company: new FormControl(''),
            agreements: new FormControl('', Validators.compose([Validators.requiredTrue])),
        },
                    {
                        validators: FuseValidators.mustMatch(
                            'password',
                            'confirmpassword'
                        ),
                    }
        );
    }

    private validateSamePassword(control: AbstractControl): ValidationErrors | null {
        const password = control.parent?.get('password');
        const confirmPassword = control.parent?.get('confirmpassword');
        if (password?.value == confirmPassword?.value) {
            if (password?.value !== undefined && password?.value !== '' && !control.parent?.get('password').hasError('pattern')) {
                control.parent?.get('password').setErrors(null);
            }
            if (confirmPassword?.value !== undefined && confirmPassword?.value !== '' && !control.parent?.get('password').hasError('pattern')) {
                control.parent?.get('confirmpassword').setErrors(null);
            }
            return null;
        }
        else {
            return { 'passwordNotMatch': true };
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void {
        // Do nothing if the form is invalid
        if (this.signUpForm.invalid) {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        this.modelAuthSignup.email = this.signUpForm.controls.email.value;
        this.modelAuthSignup.name = this.signUpForm.controls.name.value;
        this.modelAuthSignup.password = this.signUpForm.controls.password.value;
        this.modelAuthSignup.passwordConfirm = this.signUpForm.controls.confirmpassword.value;

        // Sign up
        this._authService.authSignupAuthSignupPost(this.modelAuthSignup).subscribe({
            next: (response) => {
                // Navigate to the confirmation required page
                this._router.navigateByUrl('/confirmation-required');
            }, error: (_error) => {
                // Re-enable the form
                this.signUpForm.enable();

                // Reset the form
                this.signUpNgForm.resetForm();

                var message = 'Something went wrong, please try again.';

                if(_error.status === 409 || _error.status === 500){
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
            //});
            // (response) => {
            //     // Re-enable the form
            //     this.signUpForm.enable();

            //     // Reset the form
            //     this.signUpNgForm.resetForm();

            //     // Set the alert
            //     this.alert = {
            //         type: 'error',
            //         message: 'Something went wrong, please try again.',
            //     };

            //     // Show the alert
            //     this.showAlert = true;
            // }
        });
    }
}
