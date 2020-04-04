import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';

import { LoginService } from '../login/login.service'
import { UserService } from './user.service'
import { User } from '../user/user.model';


@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
	user: User;
	page: string;

	users: User[];

	errors: [];
	success: string;
	@ViewChild('myForm', {static: false}) myForm: NgForm;
	userForm = new FormGroup({
		name: new FormControl(''),
		gender: new FormControl(''),
		dob: new FormControl(''),
		status: new FormControl('')
	});
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private loginService: LoginService,
		private userService: UserService 
	) {
		this.loginService.user.subscribe(user => {
			if(user) {
				this.user = new User(user)
			}
		});
		// this.page = this.route.snapshot.routeConfig.path;
		this.getUsers();
	}

	ngOnInit() {}

	getUsers() {
		let query:any = {};
		this.userService.getUsers(query).subscribe((users: User[] ) => {
			this.users = users;
		}, (error) => {

		})
	}

	onSubmit() {
		if(this.userForm.valid) {
			let body = {};
			
			body = {
				name: this.userForm.value.first_name,
				gender: this.userForm.value.gender,
				dob: this.userForm.value.dob
			};
			this.userService.saveUser(body).subscribe((res) => {
				this.errors = null;
				this.success = "User added successfully";
				this.myForm.resetForm();
				this.getUsers();
			},
			(error) => {
				console.log(error)
				this.errors = error.error.errors
			})
		}
	}

	updateUser() {

	}
}
