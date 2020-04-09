import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../user/user.model';
import { LoginService } from '../../login/login.service'
import { UserService } from '../../user/user.service'

function MustMatch(controlName: string, matchingControlName: string): ValidatorFn {
	return (control: AbstractControl): {
		[key: string]: any
	} | null => {

		// self value (e.g. retype password)
		let v = control.value;
		// control value (e.g. password)
		let e = control.root.value[controlName];
		// value not equal
		if (e && v !== e) return {
			validateEqual: false
		}
		console.log("here")
		return null;
	}
}

@Component({
	selector: 'app-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

	changePasswordForm = new FormGroup({
		password: new FormControl('', [Validators.required, Validators.minLength(6)]),
		newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
		repeatPassword: new FormControl('', [Validators.required, Validators.minLength(6), MustMatch('newPassword', 'repeatPassword')])
	});

	user: User;
	error: string;
	success: string;

	@ViewChild('myForm', { static: false }) myForm: NgForm;

	constructor(
		private loginService: LoginService,
		private userService: UserService
	) {
		this.loginService.user.subscribe(user => {
			if (user) {
				this.user = new User(user)
			} else
				this.user = user;
		});
	}

	ngOnInit() {}

	onSubmit() {
		if (this.changePasswordForm.valid) {
			this.userService.changePassword(this.user.id, { password: this.changePasswordForm.value.password, newPassword: this.changePasswordForm.value.newPassword })
				.subscribe((res: any) => {
						this.error = null;
						this.success = "Password Updated Successfully."
						this.myForm.resetForm();
					},
					(error: any) => {
						console.log(error)
						this.error = error.error.error;
						this.myForm.resetForm();
						// this.loading = false;
					});
		}
	}
}
