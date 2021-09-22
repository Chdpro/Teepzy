import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DatapasseService {
  private subject = new Subject<any>();
  private subjectPost = new Subject<any>();
  private subjectProdut = new Subject<any>();
  private subjectProject = new Subject<any>();
  private subjectRoom = new Subject<any>();
  private subjectFavorite = new Subject<any>();
  private subjectLike = new Subject<any>();

  private subjectVideo = new Subject<any>();

  private subjectPostDeletedId = new Subject<any>();
  constructor() {}

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

  sendRoom(room) {
    this.subjectRoom.next(room);
  }

  getRoom(): Observable<any> {
    return this.subjectRoom.asObservable();
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
    // console.log(data)
    this.subjectRoom.next(data);
  }

  get(): Observable<any> {
    return this.subjectRoom.asObservable();
  }

  sendPostDeletedId(data) {
    // console.log(data)
    this.subjectPostDeletedId.next(data);
  }

  getPostDeletedId(): Observable<any> {
    return this.subjectPostDeletedId.asObservable();
  }

  sendLike(data) {
    // console.log(data)
    this.subjectLike.next(data);
  }

  getLike(): Observable<any> {
    return this.subjectLike.asObservable();
  }

  sendVideo(data) {
    // console.log(data)
    this.subjectVideo.next(data);
  }

  getVideo(): Observable<any> {
    return this.subjectVideo.asObservable();
  }

  sendFavorite(data) {
    // console.log(data)
    this.subjectFavorite.next(data);
  }

  getFavorite(): Observable<any> {
    return this.subjectFavorite.asObservable();
  }
}
