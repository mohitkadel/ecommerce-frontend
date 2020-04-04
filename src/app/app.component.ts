import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { LoginService } from './login/login.service'
import { User } from './user/user.model';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'frontend';
	user: User;
	page: string;
	constructor(
		private router: Router,
		private loginService: LoginService,
		private route: ActivatedRoute) {
		this.loginService.user.subscribe(user => {
			if(user) {
				this.user = new User(user)
			}
		});
		// this.page = this.route.snapshot.routeConfig.path;
	}

	ngOnInit() {
		console.log(this.route.snapshot)

	}

	logout() {
		this.loginService.logout();
		this.router.navigate(['/login']);
	}
}
