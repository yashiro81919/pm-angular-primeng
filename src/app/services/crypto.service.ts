import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Cmc } from '../models/cmc';
import { Crypto } from '../models/crypto';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private url = environment.baseURL + environment.cryptoEndpoint;
  private cmcUrl = environment.baseURL + environment.cmcEndpoint;

  constructor(private http: HttpClient) { }

  listCmcObjects(): Observable<Cmc[]> {
    return this.http.get<any[]>(this.cmcUrl).pipe(map((data) => {
      return data.map<Cmc>(row => {
        return { cmcId: row.id, name: row.name, price: row.quote.USD.price };
      });
    }));
  }

  listCryptos(): Observable<Crypto[]> {
    return this.http.get<any[]>(this.url).pipe(map((data) => {
      return data.map<Crypto>(row => {
        return {cmcId: row.cmcId, quantity: row.quantity, remark: row.remark, name: '', price: 0};
      });
    }));
  }

  deleteCrypto(cmcId: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${cmcId}`);
  }

  addCrypto(crypto: Crypto): Observable<string> {
    const body = {cmcId: crypto.cmcId, quantity: crypto.quantity, remark: crypto.remark}
    return this.http.post<string>(this.url, body);
  }

  updateCrypto(crypto: Crypto): Observable<string> {
    const body = {cmcId: crypto.cmcId, quantity: crypto.quantity, remark: crypto.remark}
    return this.http.put<string>(this.url, body);
  }
}
