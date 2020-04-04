import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { LoginService } from '../login/login.service'
import { User } from './user.model';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	_user: User;

	constructor(private http: HttpClient, private loginService: LoginService) {
		if (this.loginService.userValue) {
			this._user = new User(this.loginService.userValue);
		}
	}

	get user() {
		return this._user;
	}

	getUsers(query) {
		return this.http.get('/users', { params: query })
			.pipe(map((data: User[]) => {
				let users: User[] = [];
				for (let user of data) {
					users.push(new User(user))
				}
				return users;
			}));
	}

	saveUser(body) {
		return this.http.post('/users', body);
	}

	updateUser(id, body) {
		return this.http.put('/users/' + id, body)
			.pipe(map((data: User) => {
				localStorage.setItem('user', JSON.stringify(data));
				return data;
			}));
	}

	changePassword(id, body) {
		return this.http.put('/users/' + id + '/change-password', body);
	}

	/**
	 * [order description]
	 * @param {[type]} body Array of products to order
	 * {
	 * 		product_id,
	 * 		final_price,
	 * 		quantity
	 * 		coupon_code (optional) - which coupon is applied
	 * }
	 */
	order(body) {
		console.log('this.user.id')
		console.log(body)
		return this.http.post('/users/' + this.user.id + '/order', { orders: body })
			.pipe(map((data: User) => {
				localStorage.setItem('user', JSON.stringify(data));
				return data;
			}));
	}
}
