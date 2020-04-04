import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../user/user.service';
import { ProductsService } from '../../home/products.service';

@Component({
	selector: 'app-orders',
	templateUrl: './orders.component.html',
	styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

	_orders;

	constructor(
		private userService: UserService,
		private router: Router,
		private productsService: ProductsService) {
		if (!this.userService.user) {
			this.router.navigate(['/login']);
		}
		else {
			this._orders = this.userService.user.orders;
			for(let order of this._orders) {
				order.product = this.productsService.getProduct(order.product_id);
			}
		}		
	}

	get orders() {
		return this._orders;
	}

	ngOnInit() {}


	getProduct(productId) {
		return this.productsService.getProduct(productId);
	}

}
