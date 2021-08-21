import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AES, enc } from 'crypto-js';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Key } from '../models/key';

@Injectable({
  providedIn: 'root'
})
export class KeyService {

  private url = environment.baseURL + environment.keyEndpoint;
  private secretKey = 'pm-sty';

  constructor(private http: HttpClient) { }

  encrypt(value: string): string {
    return AES.encrypt(value, this.secretKey).toString();
  }

  decrypt(value: string): string {
    return AES.decrypt(value, this.secretKey).toString(enc.Utf8);
  }

  searchKeys(value: string): Observable<Key[]> {
    return this.http.get<any[]>(`${this.url}?name=${value}`).pipe(map((data) => {
      return data.map<Key>(row => {
        return { name: row.name, key: this.decrypt(row.key), value: this.decrypt(row.value) };
      })
    }));
  }

  deleteKey(name: string): Observable<string> {
    return this.http.delete<string>(`${this.url}/${name}`);
  }

  addKey(key: Key): Observable<string> {
    const body = {name: key.name, key: this.encrypt(key.key), value: this.encrypt(key.value)}
    return this.http.post<string>(this.url, body);
  }

  updateKey(key: Key): Observable<string> {
    const body = {name: key.name, key: this.encrypt(key.key), value: this.encrypt(key.value)}
    return this.http.put<string>(this.url, body);
  }
}
