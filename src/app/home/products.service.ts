import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Product } from './product.model';

class Cart {
	quantity: number;
	product: Product;
}

@Injectable({
	providedIn: 'root'
})
export class ProductsService {

	private productSubject: BehaviorSubject < Product[] > ;
	private cartSubject: BehaviorSubject < Cart[] > ;

	public products: Observable < Product[] > ;
	public cart: Observable < Cart[] > ;
	private _cart: any = [];

	constructor(private http: HttpClient) {

		this.productSubject = new BehaviorSubject < Product[] > ([]);
		this.cartSubject = new BehaviorSubject < Cart[] > (this.getCartFromLocalStorage());

		this.products = this.productSubject.asObservable();
		this.cart = this.cartSubject.asObservable();
	}


	getProducts(query) {
		return this.http.get('/products', { params: query })
			.pipe(map((data: Product[]) => {
				let products: Product[] = [];
				for (let product of data) {
					products.push(new Product(product))
				}

				// store user details and basic auth credentials in local storage to keep user logged in between page refreshes
				this.productSubject.next(products);
				return products;
			}));
		// .pipe(map((data: User[]) => {
		// 		let users: User[] = [];
		// 		for(let user of data) {
		// 			users.push(new User(user))
		// 		}
		// 		return users;
		// 	}));
	}


	getProduct(id: string) {
		return this.http.get('/products/' + id)
			.pipe(map((data: Product) => {
				return new Product(data);
			}));
	}

	getCartFromLocalStorage() {
		let cart = JSON.parse(localStorage.getItem('cart')) || [];
		for (let item of cart) {
			item.product = new Product(item.product);
		}
		return cart;
	}

	pushToLocalStorage(c: any) {
		let cart: any = JSON.parse(localStorage.getItem('cart')) || [];
		if(Array.isArray(c)) {
			for(let obj of c) {
				obj.product = JSON.parse(obj.product.toString());
			}
			cart = c;
		}
		else{
			c.product = JSON.parse(c.product.toString());
			cart.push(c);
		}

		localStorage.setItem('cart', JSON.stringify(cart));
	}

	updateCart(cart) {
		this.pushToLocalStorage(cart);
		this.cartSubject.next(this.getCartFromLocalStorage());
	}
}
