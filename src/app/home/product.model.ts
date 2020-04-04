class Image {
	private _url: string;
	private _name: string;
	private _product_id: string;

	constructor(image, _product_id) {
		this._name = image.name;
		this._url = image.url;
		this._product_id = _product_id;
	}


	get productId() {
		return this._product_id;
	}

	get name() {
		return this._name;
	}

	get url() {
		return "http://localhost:8080/api/products/" + this.productId + "/images/" + this.name;
	}
}

export class Product {
	private _title: string;
	private _description: string;
	private _type: string;
	private _quantity: number;
	private _status: string;
	private _images: Image[];
	private _price: number;
	private _product_id: string;
	private _id: string;

	constructor(product) {
		for (let key in product) {
			if(key == "_id") {
				this._id = product._id;
			}
			else
				this["_" + key] = product[key]
		}
		console.log('this')
		console.log(this)
	}

	get id() {
		return this._id;
	}

	get title() {
		return this._title;
	}

	get description() {
		return this._description;
	}

	get type() {
		return this._type;
	}

	get quantity() {
		return this._quantity;
	}

	get status() {
		return this._status;
	}

	get price() {
		return this._price;
	}
	
	get images() {
		console.log("here/...")
		let images = [];
		for(let image of this._images) {
			images.push(new Image(image, this.id));
		}
		return images;
	}

	toString(): string {
		let obj:any = {};
		for(let key in this) {
			obj[key.slice(1)] = this[key]
		}
		return JSON.stringify(obj);
	}
}
