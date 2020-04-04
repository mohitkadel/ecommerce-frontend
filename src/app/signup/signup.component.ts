import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { SignupService } from './signup.service';
import { LoginService } from '../login/login.service';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

	signupForm = new FormGroup({
		email: new FormControl(''),
		password: new FormControl(''),
		name: new FormControl(''),
		dob: new FormControl(''),
		gender: new FormControl('')
	});

	errors
	success

	@ViewChild('myForm', {static: false}) myForm: NgForm;

	constructor(
		private signupService: SignupService,
		private loginService: LoginService,
		private route: ActivatedRoute,
		private router: Router) {
		if (this.loginService.userValue) {
			this.router.navigate(['/']);
		}
	}

	ngOnInit() {}

	onSubmit() {
		if(this.signupForm.valid) {
			let body = {};
			
			body = {
				name: this.signupForm.value.name,
				gender: this.signupForm.value.gender,
				dob: this.signupForm.value.dob,
				email: this.signupForm.value.email,
				password: this.signupForm.value.password
			};
			console.log('body')
			console.log(body)
			this.signupService.signup(body).subscribe((res) => {
				this.errors = null;
				this.success = "Updated successfully";
				this.loginService.makeLogin(res);
				this.router.navigate(['/']);
			},
			(error) => {
				console.log(error)
				this.errors = error.error.errors
			})
		}
	}

}
