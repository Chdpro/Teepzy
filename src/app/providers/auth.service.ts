import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient,} from '@angular/common/http';
import { base_url, test_url, local_url } from 'src/config';
import { Observable, of } from 'rxjs';
import { codes } from '../data/code';


const httpOptionsJson = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  })
};


const httpOptionsUrlEncoded = {
  headers: new HttpHeaders({
    "Content-Type": "application/x-www-form-urlencoded",

  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(user): Observable<any> {
    let url = 'users/authenticate';
    return this.http.post(base_url + url, user, httpOptionsJson);
  }


  check(user): Observable<any> {
    let url = 'users/check';
    return this.http.post(base_url + url, user, httpOptionsJson);
  }


  update(user): Observable<any> {
    let url = 'users/update';
    return this.http.post(base_url + url, user, httpOptionsJson);
  }

  changePassword(user): Observable<any> {
    let url = 'users/updatePass';
    return this.http.post(local_url + url, user, httpOptionsJson);
  }

  updateInfo(user): Observable<any> {
    let url = 'users/updateInfo';
    return this.http.post(local_url + url, JSON.stringify(user), httpOptionsJson);
  }

  updateProfile(user): Observable<any> {
    let url = 'users/updateProfile';
    return this.http.post(base_url + url, JSON.stringify(user), httpOptionsJson);
  }

  updateProfile2(user): Observable<any> {
    let url = 'users/updateProfile2';
    return this.http.post(base_url + url, JSON.stringify(user), httpOptionsJson);
  }


  listCodes(): Observable<any>{
    return of(codes);
  }


  signup(user) {
    let url = 'users/register';
    return this.http.post(base_url + url, user, httpOptionsJson);
  }


  myInfos(id) {
    let url = 'users/user/' + id
    return this.http.get(base_url + url, httpOptionsJson)
  }


    

}


