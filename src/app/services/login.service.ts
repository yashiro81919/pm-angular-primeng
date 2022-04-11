import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url = environment.baseURL + environment.loginEndpoint;
  
  constructor(private http: HttpClient) { }

  login(user: User): Observable<string> {
    return this.http.post<string>(this.url, user);
  }
}
