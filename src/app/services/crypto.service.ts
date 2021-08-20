import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private url = environment.cryptoEndpoint;

  constructor(private http: HttpClient) { }

  listCryptos() {
    return this.http.get<any[]>(this.url);
  }

  deleteCrypto(cmc_id: number) {
    return this.http.delete(`${this.url}/${cmc_id}`);
  }

  addCrypto(crypto: any) {
    return this.http.post(this.url, crypto);
  }

  updateCrypto(crypto: any) {
    return this.http.put(this.url, crypto);
  }
}
