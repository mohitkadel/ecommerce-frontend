interface ICoupon {
    code: string;
    discount: number;
    exp_time: string;
}

class Order {
    private _product_id: string;
    private _product_price: number;
    private _final_price: number;
    private _status: string;
    private _coupon: ICoupon;

    constructor(order) {
        this._product_id = order.product_id;
        this._product_price = order.product_price;
        this._final_price = order.final_price;
        this._status = order.status;
        this._coupon = order.coupon;
    }

    get product_id() {
        return this._product_id;
    }

    get product_price() {
        return this._product_price;
    }

    get final_price() {
        return this._final_price;
    }

    get status() {
        return this._status
    }

    get coupon() {
        return this._coupon;
    }

}

export class User {
    private _id: string;
    private _email: string;
    private _name: string;
    private _gender: string;
    private _dob: string;
    private _status: string;
    private _role: number;
    private _orders: Order[];
    private _token: string;
    private _created_at: string;
    private _updated_at: string;

    constructor(user) {
    	this._id = user._id
    	this._email = user.email;
    	this._name = user.name;
        this._gender = user.gender;
        this._dob = user.dob;
    	this._status = user.status;
    	this._role = user.role;
    	this._token = user.token;
    	this._created_at = user.created_at;
    	this._updated_at = user.updated_at;

        for(let order of user.orders) {
            this._orders.push(new Order(order));
        }
    }

    get name() {
    	return this._name;
    }

    get id() {
    	return this._id;
    }

    get email() {
    	return this._email;
    }

    get profile() {
    	return this._gender;
    }

    get status() {
    	return this._status;
    }

    // get role() {
    // 	for(let role in Role) {
    // 		if(Role[role] == this._role)
    // 			return role;
    // 	}
    // 	return this._role;
    // }

    get token() {
    	return this._token;
    }

    get orders(): Order[] {
        return this._orders;
    }

    get gender() {
        return this._gender;
    }

    get dob() {
        return this._dob;
    }


}