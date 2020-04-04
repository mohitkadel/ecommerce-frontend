import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { User } from '../user/user.model';

class LoginResponse {
	data: User;
	token: string;
}

@Injectable({
	providedIn: 'root'
})
export class LoginService {

	private userSubject: BehaviorSubject < User > ;
	public user: Observable < User > ;

	public get userValue(): User {
		console.log('this.userSubject.value')
		console.log(this.userSubject.value)
		return this.userSubject.value;
	}

	constructor(private http: HttpClient) {
		this.userSubject = new BehaviorSubject < User > (JSON.parse(localStorage.getItem('user')));
		this.user = this.userSubject.asObservable();
	}

	makeLogin(res) {
		localStorage.setItem('user', JSON.stringify(res.data));
		localStorage.setItem('token', JSON.stringify(res.token));
		this.userSubject.next(res.data);
	}

	login(body) {
		return this.http.post("/login", body)
			.pipe(map((res: LoginResponse) => {
				// store user details and basic auth credentials in local storage to keep user logged in between page refreshes
				this.makeLogin(res);
				return res.data;
			}, (error: any) => {
				console.log(error);
				return error;
			}));
	}

	logout() {
		// remove user from local storage to log user out
		localStorage.removeItem('user');
		this.userSubject.next(null);
	}

	get token(): string {
		if (this.userValue) {
			return JSON.parse(localStorage.getItem('token'));
		}

		return null
	}
}
