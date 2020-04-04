import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Product } from './product.model';
import { UserService } from '../user/user.service'
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

	constructor(
		private http: HttpClient,
		private userService: UserService) {
		if(this.userService.user) {
			this.cartSubject = new BehaviorSubject < Cart[] > (this.getCartFromLocalStorage());
			this.cart = this.cartSubject.asObservable();
		}
		this.productSubject = new BehaviorSubject < Product[] > ([]);

		this.products = this.productSubject.asObservable();
	}

	public get cartValue(): Cart[] {
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
		let cart = JSON.parse(localStorage.getItem('cart' + this.userService.user.id)) || [];
		for (let item of cart) {
			item.product = new Product(item.product);
		}
		return cart;
	}

	pushToLocalStorage(c: any) {
		let cart: any = JSON.parse(localStorage.getItem('cart' + this.userService.user.id)) || [];
		if (Array.isArray(c)) {
			for (let obj of c) {
				obj.product = JSON.parse(obj.product.toString());
			}
			cart = c;
		} else {
			c.product = JSON.parse(c.product.toString());
			cart.push(c);
		}

		localStorage.setItem('cart' + this.userService.user.id, JSON.stringify(cart));
	}

	updateCart(cart) {
		this.pushToLocalStorage(cart);
		this.cartSubject.next(this.getCartFromLocalStorage());
	}
}
