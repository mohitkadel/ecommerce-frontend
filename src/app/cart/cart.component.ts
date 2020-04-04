import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductsService } from '../home/products.service';
import { UserService } from '../user/user.service';
import { Product } from '../home/product.model';
import * as _ from 'lodash';

class Cart {
	quantity: number;
	product: Product;
}
@Component({
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

	private subject: BehaviorSubject < Cart[] > ;
	cart: any;
	totalPrice: number = 0;
	couponForm = new FormGroup({
		email: new FormControl(''),
		password: new FormControl(''),
	});

	constructor(private productsService: ProductsService, private userService: UserService) {

	}

	ngOnInit() {
		this.productsService.cart.subscribe((cart) => {
			this.cart = cart;
		});
	}

	applyCoupon() {}

	getQuantity(n: number): any[] {
		return Array(n);
	}

	changeQuantity() {

	}

	updateCart() {
		// this.productsService.updateCart()
	}

	removeFromCart(productId) {
		_.remove(this.cart, (obj) => {
			return obj.product.id == productId;
		})
		this.productsService.updateCart(this.cart);
	}

	// http://localhost:4200/account/orders
	makePayment() {
		let body: any = [];
		for (let cart of this.cart) {
			body.push({ product_id: cart.product.id, final_price: cart.product.price, quantity: cart.quantity })
		}
		this.userService.order(body).subscribe((res) => {
			console.log(res)
		}, (error) => {
			console.log(error)
		})
	}

}
