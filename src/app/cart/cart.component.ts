import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductsService } from '../home/products.service';
import { UserService } from '../user/user.service';
import { LoginService } from '../login/login.service';
import { Product } from '../home/product.model';
import { Cart, Bucket, DiscountApplied } from '../cart/cart.model';
import * as _ from 'lodash';

@Component({
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

	// private subject: BehaviorSubject < Cart[] > ;
	cart: Cart = new Cart({});
	coupons: any = [];
	private _allCoupons: any;
	couponForm = new FormGroup({
		email: new FormControl(''),
		password: new FormControl(''),
	});

	constructor(
		private productsService: ProductsService,
		private userService: UserService,
		private loginService: LoginService,
		private router: Router
	) {
		if (!this.loginService.userValue) {
			this.router.navigate(['/login']);
		}

		
	}

	filterCoupons() {
		this.coupons = [];
		for (let coupon of this._allCoupons) {
			let i = 0;
			for (let rule of coupon.rules) {
				let found = _.find(this.cart.bucket, (cart) => {
					if (rule.product_type == cart.product.type) {
						return this.checkCondition(cart, rule);
					}
				})

				if(found) {
					i++;
				}
			}

			if(coupon.rules.length == i) {
				this.coupons.push(coupon)
			}
		}
	}

	checkCondition(cart, rule) {
		switch (rule.condition) {
				case "gte":
					return cart.quantity >= rule.product_quantity
					break;
				case "eq":
					return cart.quantity == rule.product_quantity
					break;
				case "gt":
					return cart.quantity > rule.product_quantity
					break;
				case "lt":
					return cart.quantity < rule.product_quantity
					break;
				case "lte":
					return cart.quantity <= rule.product_quantity
					break;
				default:
					return false;
					break;
			}
	}

	ngOnInit() {
		this.productsService.getCoupons().subscribe((coupons) => {
		 	this._allCoupons = coupons;
		 	this.productsService.cart.subscribe((cart: Cart) => {
				this.cart = cart;
				if(this.cart.bucket.length) {
					this.filterCoupons();
				}

				if(this.cart.discounts_applied) {

				}
			});
		});

		
	}

	applyCoupon(coupon) {
		if(!coupon) {
			this.cart.discounts_applied = [];
		}
		else {
			let discountPrice = 0;

			for(let item of this.cart.bucket) {
				
				let found = _.find(coupon.rules, (rule) => {
					return rule.product_type == item.product.type && this.checkCondition(item, rule);
				})

				if (found) {

					discountPrice += ((coupon.discount / 100) * item.total);

					item.final_price = item.total - ((coupon.discount / 100) * item.total);

					item.coupon_code = coupon.code;

				}
				else {
					item.final_price = item.total;
					item.coupon_code = undefined;
				}
			}

			let discountApplied:any = {
				code: coupon.code,
				percentage: coupon.discount,
				price: discountPrice,
				exp_time: coupon.exp_time
			}
			this.cart.addDiscountApplied(discountApplied)
		}

		this.productsService.updateCart(this.cart);
	}

	getQuantity(n: number): any[] {
		return Array(n);
	}

	updateDiscount() {
		if(!this.cart.discounts_applied || (this.cart.discounts_applied && this.cart.discounts_applied.length == 0)) {
			return 
		}

		let found = false;
		this.cart.discounts_applied[0].price = 0;
		for(let item of this.cart.bucket) {
			if(item.coupon_code) {
				let coupon = _.find(this.coupons, (coupon) => {
					let exist = _.find(coupon.rules, (rule) => {
						return rule.product_type == item.product.type && this.checkCondition(item, rule);
					})
					return coupon.code == item.coupon_code && exist
				})

				if(coupon) {
					this.applyCoupon(coupon)
					found = true;
				}
				else {
					item.final_price = item.total;
					item.coupon_code = undefined;
				}
				
				// this.cart.discounts_applied[0].price += item.total - item.final_price;

			}
		} 

		if(!found) {
			this.cart.discounts_applied = [];
		}
	}

	/*resetDiscount() {
		for(let item of this.cart.bucket) {
			delete item.coupon_code;
			item.final_price = item.total;
		}
		this.cart.discounts_applied = [];
	}*/

	removeFromCart(i) {
		_.remove(this.cart.bucket, (obj, index) => {
			return index == i;
		})
		if(this.cart.bucket.length==0) {
			this.cart = new Cart({})
		}
		this.updateDiscount();
		// this.resetDiscount();
		this.productsService.updateCart(this.cart);
	}

	onQuantityChange() {
		this.filterCoupons();
		this.updateDiscount();
		this.productsService.updateCart(this.cart)
	}

	// // http://localhost:4200/account/orders
	makePayment() {
		let body: any = [];
		for (let bucket of this.cart.bucket) {
			let order:any = {};
			order.product_id = bucket.product.id
			order.product_price = bucket.total
			order.final_price = bucket.final_price;
			order.quantity = bucket.quantity;

			if(this.cart.discounts_applied && this.cart.discounts_applied.length && bucket.coupon_code == this.cart.discounts_applied[0].code) {
				order.coupon_code = this.cart.discounts_applied[0].code
			}

			body.push(order)
		}

		this.userService.order(body).subscribe((res) => {
			// Remove products from cart
			this.productsService.updateCart(new Cart({}))
			localStorage.setItem('user', JSON.stringify(res));
			this.loginService.updateUserInfo(res);
			this.router.navigate(['/account/orders']);
		}, (error) => {
			console.log(error)
		})
	}
}
