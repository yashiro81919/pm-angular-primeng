import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Key } from '../models/key';

@Injectable({
  providedIn: 'root'
})
export class KeyService {

  private url = environment.baseURL + environment.keyEndpoint;

  constructor(private http: HttpClient) { }

  searchKeys(value: string): Observable<Key[]> {
    return this.http.get<any[]>(`${this.url}?name=${value}`).pipe(map((data) => {
      return data.map<Key>(row => {
        return { name: row.name, key: row.key, value: row.value };
      })
    }));
  }

  deleteKey(name: string): Observable<string> {
    return this.http.delete<string>(`${this.url}/${name}`);
  }

  addKey(key: Key): Observable<string> {
    const body = {name: key.name, key: key.key, value: key.value}
    return this.http.post<string>(this.url, body);
  }

  updateKey(key: Key): Observable<string> {
    const body = {name: key.name, key: key.key, value: key.value}
    return this.http.put<string>(this.url, body);
  }
}
