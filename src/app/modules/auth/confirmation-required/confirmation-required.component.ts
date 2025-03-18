import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { ModelAuthVerifyEmail } from 'app/shared/api/model/models'
import { AuthService } from 'app/shared/api/services/api'
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';

@Component({
    selector: 'auth-confirmation-required',
    templateUrl: './confirmation-required.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    imports: [
        RouterLink,
        FuseAlertComponent,
    ]
})
export class AuthConfirmationRequiredComponent implements OnInit {
    verificationCode: string;
    confirmationHeader: string = 'Confirmation required';
    confirmationDescription: string = `A confirmation mail with instructions has been sent to your
                                       email address. Follow those instructions to confirm your email
                                       address and activate your account.`;

    modelAuthVerifyEmail: ModelAuthVerifyEmail = {
        verificationCode: ''
    };

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };

    showAlert: boolean = false;
    /**
     * Constructor
     */
    constructor(private _authService: AuthService, private route: ActivatedRoute) { }

    /**
    * On init
    */
    ngOnInit(): void {
        // Get Verification Code from Query String
        // this.route.queryParams.subscribe(params => {
        //     this.modelAuthVerifyEmail.verificationCode = params['verificationCode'];
        // });

        this.modelAuthVerifyEmail.verificationCode = this.route.snapshot.params['id'];

        if (this.modelAuthVerifyEmail.verificationCode != undefined && this.modelAuthVerifyEmail.verificationCode != null && this.modelAuthVerifyEmail.verificationCode != '') {
            // Hide the alert
            this.showAlert = false;
            // Verify Email
            this._authService.verifyEmailAuthVerifyEmailPost(this.modelAuthVerifyEmail).subscribe({
                next: (response) => {
                    if (response.status === 'SUCCESS' && response.message === 'Email Verified.') {
                        this.confirmationHeader = 'Email Verified Successfully!';
                        this.confirmationDescription = 'Your email has been successfully verified! You can now access your account.'
                    }

                }, error: (_error) => {
                    var message = 'Something went wrong, please try again.';

                    if (_error.status === 409 || _error.status === 500 || _error.status === 400) {
                        message = _error?.error['detail'];
                        this.confirmationHeader = 'Email Verification Failed';
                        this.confirmationDescription = 'The request for email verification was invalid or could not be processed. Please check your details and try again. If the issue persists, contact support for assistance.'
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
}
