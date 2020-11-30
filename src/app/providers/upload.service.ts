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

@Injectable({
  providedIn: 'root'
})
export class UploadService {


  constructor(private http: HttpClient) { }

  uploadFileInBase64(file): Observable<any> {
    let url = 'upload-avatar-base64';
    return this.http.post(base_url + url, file, httpOptionsJson);
  }

  upload(file): Observable<any> {
    let url = 'uploadfile';
    return this.http.post(base_url + url, file, httpOptionsJson);
  }

}
