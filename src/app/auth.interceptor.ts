import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginService } from './login/login.service';
import { filter, map, catchError } from 'rxjs/operators';
import { of, throwError  } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private loginService: LoginService) {}

    intercept(request: HttpRequest < any > , next: HttpHandler): Observable < HttpEvent < any >> {
        // add authorization header with basic auth credentials if available
        const user = this.loginService.user;
        const token = this.loginService.token;
        if (user && this.loginService.token) {
            request = request.clone({
                setHeaders: {
                    'x-access-token': `${token}`
                }
            });
        }
        // request = request.clone({
        //     setHeaders: {
        //         'Access-Control-Allow-Origin': '*'
        //     }
        // });
        console.log('request')
        console.log(request)
        request = request.clone({ url: ' https://ecommerce-api-v1.herokuapp.com/api' + request.url });

        return next.handle(request)
        .pipe(
            // filter(event => event instanceof HttpResponse),
            // map((event: HttpResponse < any > ) => {
            //     console.log('event')
            //     console.log(event)
            //     return event;
            // })
            catchError((error: any) => {
                if(error.status === 403) {
                    this.loginService.logout();
                }
                // console.log('of(error)')
                // console.log(of(error))
                // return of(error);
                return throwError(error);
            })
        );
    }
}
