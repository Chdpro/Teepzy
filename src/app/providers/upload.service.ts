import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient,} from '@angular/common/http';
import { base_url, test_url, local_url } from 'src/config';
import { Observable, of } from 'rxjs';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';


const httpOptionsJson = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  })
};

@Injectable({
  providedIn: 'root'
})
export class UploadService {


  constructor(private http: HttpClient, private transfer: FileTransfer) { }

  uploadFileInBase64(file): Observable<any> {
    let url = 'upload-avatar-base64';
    return this.http.post(base_url + url, file, httpOptionsJson);
  }

  upload(file): Observable<any> {
    let url = 'uploadfile';
    return this.http.post(base_url + url, file, httpOptionsJson);
  }

  uploadImage(img) {
    let key = 'upload-avatar';
    // Destination URL
    let url = base_url + key;
    // File for Upload
    var targetPath = img;
    var options: FileUploadOptions = {
      fileKey: 'avatar',
      chunkedMode: false,
      fileName: (Math.random() * 100000000000000000) + '.jpg',
      mimeType: 'multipart/form-data',
      params: { 'desc': 'Mon image' }
    };
    const fileTransfer: FileTransferObject = this.transfer.create();
    // Use the FileTransfer to upload the image
    return fileTransfer.upload(targetPath, url, options).then(() => {
      return base_url + options.fileName;
    })
  }

}
