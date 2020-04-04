import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../user/user.model';
import { LoginService } from '../login/login.service'
import { ProductsService } from '../home/products.service'
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	user: User;
	cartQuantity: Observable<any>;

	constructor(private router: Router,
		private loginService: LoginService,
		private productsService: ProductsService) {
		this.loginService.user.subscribe(user => {
			if(user) {
				this.user = new User(user)
			}
			else
				this.user = user
		});

		this.cartQuantity =  this.productsService.cart.pipe(map(res => {
			return (res && res.length) || 0;
		}));
	}

	ngOnInit() {}

	logout() {
		this.loginService.logout();
		this.router.navigate(['/login']);
	}
}
