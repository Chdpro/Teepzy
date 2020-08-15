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
  
  sendProjects(project) {  
    this.subject.next(project);  
  }

 
  
  getProjects(): Observable<any> {  
    return this.subject.asObservable();  
  }

  sendProducts(project) {  
    this.subject.next(project);  
  }

  getProducts(): Observable<any> {  
    return this.subject.asObservable();  
  }


  getPosts(): Observable<any> {  
    return this.subject.asObservable();  
  }

  sendUserPhoto(user) {  
    this.subject.next(user);  
  }  

  getUserPhoto(): Observable<any> {  
    return this.subject.asObservable();  
  }

  send(data) {  
    this.subject.next(data);  
  }  

  get(): Observable<any> {  
    return this.subject.asObservable();  
  }
}
