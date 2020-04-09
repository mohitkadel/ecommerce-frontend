import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../home/products.service'
import { UserService } from '../user/user.service'
import { Product } from '../home/product.model';
import { Bucket } from '../cart/cart.model';

@Component({
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

	id: string;
	product: Product = new Product({});
	quantity: number = 1;
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private productService: ProductsService,
		private userService: UserService) {
		console.log("here")
		// redirect to login if not logged in
		if (!this.userService.user) {
			this.router.navigate(['/login']);
		}
	}

	ngOnInit() {console.log("here2")
		this.id = this.route.snapshot.params.id;
		this.getProduct();

		// this.page = this.route.snapshot.routeConfig.path;
	}

	getProduct() {
		this.productService.getProduct(this.id).subscribe((product: Product) => {
			this.product = product;
		})
	}

	getQuantity(n: number): any[] {
		return Array(n);
	}

	addToCart() {
		this.productService.addProductToBucket({quantity: this.quantity, product: this.product});
		this.router.navigate(['/cart']);
	}

}
