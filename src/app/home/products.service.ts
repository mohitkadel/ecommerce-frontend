import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Product } from './product.model';
import { Cart, Bucket } from '../cart/cart.model';
import { UserService } from '../user/user.service'

import * as _ from 'lodash';



@Injectable({
	providedIn: 'root'
})
export class ProductsService {

	private productSubject: BehaviorSubject < Product[] > ;
	private cartSubject: BehaviorSubject < Cart > ;

	public products: Observable < Product[] > ;
	public cart: Observable < Cart > ;

	private _cart: Cart;

	constructor(
		private http: HttpClient,
		private userService: UserService) {
		if (this.userService.user) {
			this._cart = this.getCartFromLocalStorage();
			this.cartSubject = new BehaviorSubject < Cart > (this._cart);
			this.cart = this.cartSubject.asObservable();
		}
		this.productSubject = new BehaviorSubject < Product[] > ([]);

		this.products = this.productSubject.asObservable();
	}

	get cartValue(): Cart {
		return this.cartSubject.value;
	}

	getProducts(query) {
		return this.http.get('/products', { params: query })
			.pipe(map((data: Product[]) => {
				let products: Product[] = [];
				for (let product of data) {
					products.push(new Product(product))
				}

				this.productSubject.next(products);
				return products;
			}));
	}


	getProduct(id: string) {
		return this.http.get('/products/' + id)
			.pipe(map((data: Product) => {
				return new Product(data);
			}));
	}

	getCartFromLocalStorage() {
		this._cart = new Cart(JSON.parse(localStorage.getItem('cart' + this.userService.user.id)))
		return this._cart;
	}

	addProductToBucket(product) {
		this._cart.addProductToBucket(product)
		this.updateCart(this._cart);
	}

	updateLocalStorage(cart: Cart) {
		// let cart: Cart = Object.assign(new Cart({}), c);
		localStorage.setItem('cart' + this.userService.user.id, cart.toString());
	}

	updateCart(cart) {
		this.updateLocalStorage(cart);
		this.cartSubject.next(this.getCartFromLocalStorage());
	}

	getCoupons() {
		return this.http.get("/coupons")
	}
}
