import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../home/products.service'
import { Product } from '../home/product.model';

@Component({
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

	id: string;
	product: any = {};
	quantity: number = 1;
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private productService: ProductsService) {}

	ngOnInit() {
		this.id = this.route.snapshot.params.id;
		this.getProduct();

		// this.page = this.route.snapshot.routeConfig.path;
	}

	getProduct() {
		this.productService.getProduct(this.id).subscribe((product) => {
			this.product = product;
		})
	}

	getQuantity(n: number): any[] {
		return Array(n);
	}

	addToCart() {
		this.productService.updateCart({quantity: this.quantity, product: this.product});
		this.router.navigate(['/cart']);
	}

}
