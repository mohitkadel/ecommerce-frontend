import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment'

import { User } from '../../user/user.model';
import { LoginService } from '../../login/login.service';
import { UserService } from '../../user/user.service';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {


	user: User;

	error: string;
	success: string;

	@ViewChild('myForm', { static: false }) myForm: NgForm;

	accountForm = new FormGroup({
		name: new FormControl(''),
		dob: new FormControl(''),
		gender: new FormControl('')
	});

	constructor(
		private loginService: LoginService,
		private userService: UserService,
		private http: HttpClient
	) {
		this.loginService.user.subscribe(user => {
			if (user) {
				this.user = new User(user)
			} else
				this.user = user;

			this.accountForm.setValue({
				name: user.name,
				dob: new Date(this.user.dob).toISOString().substring(0, 10),
				gender: user.gender
			})
		});
	}

	ngOnInit() {}

	onSubmit() {
		console.log(this.accountForm.valid)
		if (this.accountForm.valid) {
			let body:any = {};
			body.name = this.accountForm.value.name;
			body.gender = this.accountForm.value.gender;
			body.dob = this.accountForm.value.dob;

			this.userService.updateUser(this.user.id, body).subscribe((user: User) => {
				this.user = user;
				this.success = "Details updated successfully."
			}, error => {
				console.log(error)
				this.error = error.error;
				// this.loading = false;
			})
		}
	}
}
