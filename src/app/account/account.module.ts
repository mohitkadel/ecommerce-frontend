import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AccountComponent } from './account.component';
import { FormComponent } from './form/form.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { OrdersComponent } from './orders/orders.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
		path: 'account',
		component: AccountComponent,
		children: [
			{ path: '', component: FormComponent },
			{ path: 'orders', component: OrdersComponent },
			{ path: 'change-password', component: ChangePasswordComponent },
		]
	},
	// { path: 'orders', component: OrdersComponent },
	// { path: 'change-password', component: ChangePasswordComponent },
	// { path: 'form', component: FormComponent },
]

@NgModule({
	// exports: [
	// 	AccountModule
	// ],
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild(routes),
		ReactiveFormsModule,
		HttpClientModule,
	],
	declarations: [
		AccountComponent,
		FormComponent,
		AccountComponent,
		ChangePasswordComponent,
		OrdersComponent
	]
})
export class AccountModule {}
