import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../user/user.model';
import { LoginService } from '../login/login.service'

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

	accountForm = new FormGroup({
		name: new FormControl(''),
		dob: new FormControl(''),
		gender: new FormControl('')
	});

	user: User;

	@ViewChild('myForm', {static: false}) myForm: NgForm;
	
	constructor(private loginService: LoginService) {
		this.loginService.user.subscribe(user => {
			if(user) {
				this.user = new User(user)
			}
			else
				this.user = user
		});
	}

	ngOnInit() {}

}
