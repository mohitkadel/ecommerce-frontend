import { Product } from '../home/product.model';

export class Bucket {
	private _quantity: number;
	private _product: Product;
	private _coupon_code: string;

	private _final_price: number;
	constructor(bucket) {
		this._quantity = bucket.quantity;
		this._product = bucket.product;
		this._final_price = bucket.final_price || this.total;
		this._coupon_code = bucket.coupon_code;
	}

	set coupon_code(code) {
		this._coupon_code = code;
	}

	get coupon_code() {
		return this._coupon_code;
	}

	get product() {
		return new Product(this._product); 
	}

	get quantity() {
		return this._quantity;
	}

	set quantity(quantity) {
		this._quantity = quantity;
	}

	get total() {
		return this._product.price * this._quantity;
	}

	set final_price(final_price) {
		this._final_price = final_price;
	}

	get final_price() {
		return this._final_price;
	}

	toString() {
		return JSON.stringify(this.toJSON());
	}

	toJSON() {
		let obj:any = {};
		for(let key in this) {
			if(this[key] && typeof this[key]['toJSON'] == "function") {
				obj[key.slice(1)] = this[key]['toJSON']()
			}
			else
				obj[key.slice(1)] = this[key]
		}
		return obj;
	}
}

export class DiscountApplied {
	private _code: string;
	private _percentage: number;
	private _price: number;
	private _exp_time: string;

	constructor(discountApplied) {
		for (let key in discountApplied) {
			this["_" + key] = discountApplied[key]
		}
	}

	get code() {
		return this._code;
	}

	get percentage() {
		return this._percentage;
	}

	get exp_time() {
		return this._exp_time;
	}

	get price() {
		return this._price;
	}

	set price(price) {
		this._price = price;
	}

	toString() {
		return JSON.stringify(this.toJSON());
	}

	toJSON() {
		let obj:any = {};
		for(let key in this) {
			if(this[key] && typeof this[key]['toJSON'] == "function") {
				obj[key.slice(1)] = this[key]['toJSON']()
			}
			else
				obj[key.slice(1)] = this[key]
		}
		return obj;
	}
}

export class Cart {
	private _bucket: Bucket[] = [];
	private _discounts_applied: DiscountApplied[] = [];
	private _price: number;
	private _total: number;

	constructor(cart) {
		if(cart) {
			if(cart.bucket) {
				for(let obj of cart.bucket) {
					this._bucket.push(new Bucket(obj));
				}
			}
			if(cart.discounts_applied) {
				for(let obj of cart.discounts_applied) {
					this._discounts_applied.push(new DiscountApplied(obj));
				}
			}
			
			this._price = cart.price
			this._total = cart.total
		}	
	}

	get price() {
		let price = 0;
		for(let bucket of this._bucket) {
			price += bucket.total;
		}
		this._price = price;
		return price;
	}

	get total() {
		let total = this._price;
		for(let discount of this._discounts_applied) {
			total -= discount.price;
		}
		return total;
	}

	get bucket() {
		return this._bucket;
	}

	addDiscountApplied(discountApplied: DiscountApplied) {
		this._discounts_applied = [];
		this._discounts_applied.push(new DiscountApplied(discountApplied))
	}

	set discounts_applied(discountApplied) {
		this._discounts_applied = discountApplied;
	}

	get discounts_applied() {
		return this._discounts_applied; 
	}

	addProductToBucket(product: Bucket) {
		this._bucket.push(new Bucket(product))
	}

	toString() {
		return JSON.stringify(this.toJSON());
	}

	toJSON() {
		let obj:any = {};
		for(let key in this) {
			if(this[key] && typeof this[key]['toJSON'] == "function") {
				obj[key.slice(1)] = this[key]['toJSON']()
			}
			else
				obj[key.slice(1)] = this[key]
		}
		return obj;
	}
}