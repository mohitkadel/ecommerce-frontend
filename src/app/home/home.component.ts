import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, first } from 'rxjs/operators';

import { LoginService } from '../login/login.service'
import { ProductsService } from './products.service'
import { User } from '../user/user.model';
import { Product } from './product.model';
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnChanges {

	products: Product[];
	model: string;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private loginService: LoginService,
		private productsService: ProductsService) {

		this.getProducts();

		this.productsService.products.subscribe((products: Product[]) => {
			this.products = products;
		})
	}

	ngOnInit() {}

	ngOnChanges(changes: SimpleChanges) {
		console.log(changes)
		console.log('changes')
		// this.router.navigate(['/'], { queryParams: { search: this.model } });
	}

	getProducts(query = {}) {
		this.productsService.getProducts(query).subscribe()
	}

	addToCart(productId) {
		console.log('productId')
		console.log(productId)
	}

	search = (text$: Observable < string > ) => {
		return text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			// switchMap allows returning an observable rather than maps array
			switchMap((searchText) => this.productsService.getProducts({ search: searchText })),
			catchError((error: any) => {
				console.log('error - search');
				console.log(error);
				return of(error)
			})
		);

	}

	/**
	 * Used to format the result data from the lookup into the
	 * display and list values. Maps `{name: "band", id:"id" }` into a string
	 */
	resultFormatBandListValue(value: any) {
		return value.title;
	}

	/**
	 * Initially binds the string value and then after selecting
	 * an item by checking either for string or key/value object.
	 */
	inputFormatBandListValue(value: any) {
		return value.title;
	}
}
