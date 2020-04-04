import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class SignupService {

	constructor(private http: HttpClient) {}

	signup(body) {
		return this.http.post("/signup", body)
	}
}
