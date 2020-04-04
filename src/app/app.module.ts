import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthInterceptor } from './auth.interceptor';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

import { LoginService } from './login/login.service';
import { SignupService } from './signup/signup.service';

import { AuthGuard } from './auth.guard';

import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';

// import { Role } from './user/user.model';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CartComponent } from './cart/cart.component';

import { AccountModule } from './account/account.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductComponent } from './product/product.component';


const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
	{
	    path: 'account',
	    loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
	    canActivate: [AuthGuard]
  	},
	{ path: 'product/:id', component: ProductComponent, canActivate: [AuthGuard] },
	{ path: 'login', component: LoginComponent },
	{ path: 'signup', component: SignupComponent },

	// { path: 'students', component: UserComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Teacher] } },
	// { path: 'teachers', component: UserComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Student] } },
	// { path: 'admin', component: UserComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin] }  },
	// { path: '', redirectTo: '/', pathMatch: 'full' },
	{ path: '**', component: NotFoundComponent }
];

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		SignupComponent,
		UserComponent,
		HomeComponent,
		HeaderComponent,
		FooterComponent,
		CartComponent,
		NotFoundComponent,
		ProductComponent
	],
	imports: [
		NgbModule,
		FormsModule,
		BrowserModule,
		ReactiveFormsModule,
		HttpClientModule,
		AccountModule,
		RouterModule.forRoot(routes)
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
		LoginService,
		SignupService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
