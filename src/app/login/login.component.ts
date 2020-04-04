import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';

import { LoginService } from '../login/login.service'

class Login {
	email: string;
	password: string;
}

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	error: string;

	loginForm = new FormGroup({
		email: new FormControl(''),
		password: new FormControl(''),
	});

	constructor(private route: ActivatedRoute, private router: Router, private loginService: LoginService) {
		// redirect to home if already logged in
		if (this.loginService.userValue) {
			this.router.navigate(['/']);
		}
		console.log(this.route.snapshot.queryParams['returnUrl'])
	}

	ngOnInit() {}

	onSubmit() {
		if (this.loginForm.valid) {
			let login = new Login();
			login.email = this.loginForm.value.email;
			login.password = this.loginForm.value.password;
			this.loginService.login(login)
				.subscribe(
					data => {
						this.router.navigate(['/']);
					},
					error => {
						console.log(error)
						this.error = error.error;
						// this.loading = false;
					});
		}

	}
}
