import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { base_url, test_url, local_url } from "src/config";
import { Observable, of, from } from "rxjs";
import { codes } from "../data/code";
import { Storage } from "@ionic/storage";
import { CACHE_KEYS } from "../constant/constant";

const httpOptionsJson = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

const httpOptionsUrlEncoded = {
  headers: new HttpHeaders({
    "Content-Type": "application/x-www-form-urlencoded",
  }),
};

const API_STORAGE_KEY = "specialkey";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient, private storage: Storage) {}

  login(user): Observable<any> {
    let url = "users/authenticate";
    return this.http.post(base_url + url, user, httpOptionsJson);
  }

  check(user): Observable<any> {
    let url = "stats/check";
    return this.http.post(base_url + url, user, httpOptionsJson);
  }

  update(user): Observable<any> {
    let url = "stats/update";
    return this.http.post(base_url + url, user, httpOptionsJson);
  }

  changePassword(user): Observable<any> {
    let url = "stats/updatePass";
    return this.http.post(base_url + url, user, httpOptionsJson);
  }

  updateInfo(user): Observable<any> {
    let url = "stats/updateInfo";
    return this.http.post(
      base_url + url,
      JSON.stringify(user),
      httpOptionsJson
    );
  }

  updateProfile(user): Observable<any> {
    let url = "stats/updateProfile";
    return this.http.post(
      base_url + url,
      JSON.stringify(user),
      httpOptionsJson
    );
  }

  updateUserPhoto(user): Observable<any> {
    let url = "stats/updateUserPhoto";
    return this.http.post(
      base_url + url,
      JSON.stringify(user),
      httpOptionsJson
    );
  }

  updateProfile2(user): Observable<any> {
    let url = "stats/updateProfile2";
    return this.http.post(
      base_url + url,
      JSON.stringify(user),
      httpOptionsJson
    );
  }

  listCodes(): Observable<any> {
    return of(codes);
  }

  signup(user) {
    let url = "users/register";
    return this.http.post(base_url + url, user, httpOptionsJson);
  }

  updatePlayerId(user) {
    let url = "stats/updatePlayerId";
    return this.http.post(base_url + url, user, httpOptionsJson);
  }

  myInfos(id) {
    let url = "stats/userinfo/" + id;
    console.log(id);
    console.log("here");
    return this.http.get(base_url + url, httpOptionsJson);
  }

  userFromLocal(userId): Observable<any> {
    return from(this.getLocalData(CACHE_KEYS.PROFILE + userId));
  }

  setUserToLocal(userId, user) {
    this.setLocalData(CACHE_KEYS.PROFILE + userId, user);
  }

  // Save result of API requests
  setLocalData(key, data) {
    this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
  }

  // Get cached API result
  getLocalData(key): Promise<any> {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
    //  .then((val) => {
    //  data = val
    //  alert("In block" + JSON.stringify(val))
    //  return data
    // });
    //alert("Out block" + JSON.stringify(data))
  }
}
