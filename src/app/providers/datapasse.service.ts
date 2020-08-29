import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatapasseService {


  private subject = new Subject<any>();  

  private subjectPost = new Subject<any>();  

  private subjectProdut = new Subject<any>();  
  private subjectProject = new Subject<any>();  
  private subjectRoom = new Subject<any>();  

  constructor() { }  
  
  sendPosts(posts) {  
    this.subjectPost.next(posts);  
  }
  
  sendProjects(project) {  
    this.subjectProject.next(project);  
  }

 
  
  getProjects(): Observable<any> {  
    return this.subjectProject.asObservable();  
  }

  sendProducts(project) {  
    this.subjectProdut.next(project);  
  }

  getProducts(): Observable<any> {  
    return this.subjectProdut.asObservable();  
  }


  getPosts(): Observable<any> {  
    return this.subjectPost.asObservable();  
  }

  sendUserPhoto(user) {  
    this.subject.next(user);  
  }  

  getUserPhoto(): Observable<any> {  
    return this.subject.asObservable();  
  }

  send(data) {  
    console.log(data)
    this.subjectRoom.next(data);  
  }  

  get(): Observable<any> {  
    return this.subjectRoom.asObservable();  
  }
}
