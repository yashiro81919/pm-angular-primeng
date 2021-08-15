import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AES, enc } from 'crypto-js';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KeyService {

  private url = environment.keyEndpoint;
  private secretKey = 'pm-sty';

  constructor(private http: HttpClient) { }

  encrypt(value: string) {
    return AES.encrypt(value, this.secretKey).toString();
  }

  decrypt(value: string) {
    return AES.decrypt(value, this.secretKey).toString(enc.Utf8);
  }

  searchKeys(value: string) {
    return this.http.get<any[]>(`${this.url}?name=${value}`)
      .pipe(
        tap(
          resp => {
            resp.forEach(key => {
              key.key = this.decrypt(key.key);
              key.value = this.decrypt(key.value);
            })
          }
        )
      );
  }

  deleteKey(name: string) {
    return this.http.delete(`${this.url}/${name}`);
  }

  addKey(key: any) {
    key.key = this.encrypt(key.key); 
    key.value = this.encrypt(key.value); 
    return this.http.post(this.url, key);
  }

  updateKey(key: any) {
    key.key = this.encrypt(key.key); 
    key.value = this.encrypt(key.value);     
    return this.http.put(this.url, key);   
  }
}
