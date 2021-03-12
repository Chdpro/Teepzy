import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, } from '@angular/common/http';
import { local_url, test_url, base_url } from 'src/config';
import { Observable, of, from } from 'rxjs';
import { codes } from '../data/code';
import { Storage } from '@ionic/storage';


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

const API_STORAGE_KEY = 'specialkey';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient,
    private storage: Storage, ) { }

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
    return this.http.post(base_url + url, user, httpOptionsJson);
  }

  updateInfo(user): Observable<any> {
    let url = 'users/updateInfo';
    return this.http.post(base_url + url, JSON.stringify(user), httpOptionsJson);
  }

  updateProfile(user): Observable<any> {
    let url = 'users/updateProfile';
    return this.http.post(base_url + url, JSON.stringify(user), httpOptionsJson);
  }

  updateProfile2(user): Observable<any> {
    let url = 'users/updateProfile2';
    return this.http.post(base_url + url, JSON.stringify(user), httpOptionsJson);
  }


  listCodes(): Observable<any> {
    return of(codes);
  }


  signup(user) {
    let url = 'users/register';
    return this.http.post(base_url + url, user, httpOptionsJson);
  }


  myInfos(id) {
    let url = 'users/user/' + id
    return this.http.get(base_url + url, httpOptionsJson)

    // if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
    //   // Return the cached data from Storage
    //   return from(this.getLocalData(CACHE_KEYS.PROFILE))
    // } else {
    //   // Return real API data and store it locally
    //   return this.http.get(base_url + url, httpOptionsJson)
    //   //  this.setLocalData('users', res);
    // }
  }



  // Save result of API requests
  setLocalData(key, data) {
    alert("setting new contacts to storage")
    this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
  }

  // Get cached API result
  getLocalData(key): Promise<any> {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`)
    //  .then((val) => {
    //  data = val
    //  alert("In block" + JSON.stringify(val))
    //  return data
    // });
    //alert("Out block" + JSON.stringify(data))
  }


}


