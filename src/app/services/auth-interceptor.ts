import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = localStorage.getItem('key');

    const authReq = req.clone({
      headers: req.headers.set('Content-Type', 'application/json')
        .set(environment.keyName, authToken !== null ? authToken : '')
    });

    return next.handle(authReq);
  }
}