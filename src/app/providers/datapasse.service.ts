import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatapasseService {


  private subject = new Subject<any>();  
  constructor() { }  
  
  sendPosts(posts) {  
    this.subject.next(posts);  
  }  
  
  getPosts(): Observable<any> {  
    return this.subject.asObservable();  
  }
}
