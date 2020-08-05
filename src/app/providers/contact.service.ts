import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient,} from '@angular/common/http';
import { base_url, test_url, local_url } from 'src/config';
import { Observable } from 'rxjs';


const token = localStorage.getItem('teepzyToken')

const httpOptionsJson = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    'Authorization': `${token}`,

  })
};


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  inviteViaSms(invitation): Observable<any> {
    let url = 'users/SmsInvited';
    return this.http.post(base_url + url, invitation, httpOptionsJson);
  }


  inviteToJoinCircle(invitation): Observable<any> {
    let url = 'users/inviteToJoinCircle';
    return this.http.post(base_url + url, JSON.stringify(invitation), httpOptionsJson);
  }
  

  cancelToJoinCircle(invitation): Observable<any> {
    let url = 'users/cancelToJoinCircle';
    return this.http.post(base_url + url, JSON.stringify(invitation), httpOptionsJson);
  }

  linkPeoples(invitation): Observable<any> {
    let url = 'users/linkPeople';
    return this.http.post(base_url + url, JSON.stringify(invitation), httpOptionsJson);
  }
  

  acceptInvitation(invitation): Observable<any> {
    let url = 'users/acceptToJoinCircle';
    return this.http.post(base_url + url, invitation, httpOptionsJson);
  }

  listInivtation(invitation): Observable<any> {
    let url = 'users/invitations';
    return this.http.post(base_url + url, invitation, httpOptionsJson);
  }


  listNotification(id): Observable<any> {
    let url = 'users/notifications/'+ id ;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  checkInviteViaSms(check): Observable<any> {
    let url = 'users/checkSmsInvitation';
    return this.http.post(base_url + url, check, httpOptionsJson);
  }


  deleteInviteViaSms(check): Observable<any> {
    let url = 'users/deleteSmsInvitation';
    return this.http.post(base_url + url, check, httpOptionsJson);
  }

  checkInvitationTeepzr(check): Observable<any> {
    let url = 'users/checkInvitation';
    return this.http.post(base_url + url, check, httpOptionsJson);
  }

  teepZrs(userId): Observable<any> {
    let url = 'users/teepzr/' + userId;
    return this.http.get(base_url + url, httpOptionsJson);
  }
  teepZ(userId): Observable<any> {
    let url = 'users/posts/my/' + userId;
    return this.http.get(local_url + url, httpOptionsJson);
  }

  favorites(userId): Observable<any> {
    let url = 'users/myFavorite/' + userId;
    return this.http.get(local_url + url, httpOptionsJson);
  }

  eventualKnownTeepZrs(userId): Observable<any> {
    let url = 'users/teepzr/eventualsTeepzrs/' + userId;
    return this.http.get(base_url + url, httpOptionsJson);
  }
  

  addPost(post): Observable<any> {
    let url = 'users/posts';
    return this.http.post(base_url + url, JSON.stringify(post), httpOptionsJson);
  }

  rePost(post): Observable<any> {
    let url = 'users/reposts';
    return this.http.post(base_url + url, JSON.stringify(post), httpOptionsJson);
  }

  addRePost(post): Observable<any> {
    let url = 'users/reposts';
    return this.http.post(base_url + url, JSON.stringify(post), httpOptionsJson);
  }

  addProject(project): Observable<any> {
    let url = 'users/addProject';
    return this.http.post(base_url + url, JSON.stringify(project), httpOptionsJson);
  }

  addProduct(product): Observable<any> {
    let url = 'users/addProduct';
    return this.http.post(base_url + url, JSON.stringify(product), httpOptionsJson);
  }

  getPosts(userId): Observable<any> {
    let url = 'users/posts/all/' + userId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  getSocials(): Observable<any> {
    let url = 'socials/';
    return this.http.get(base_url + url, httpOptionsJson);
  }

  getUsersMatch(userId): Observable<any> {
    let url = 'users/users/' + userId;
    return this.http.get(base_url + url, httpOptionsJson);
  }


  addCommentToPost(comment): Observable<any> {
    let url = 'users/comments/all';
    return this.http.post(base_url + url, JSON.stringify(comment), httpOptionsJson);
  }

  getCommentsOfComment(postId): Observable<any> {
    let url = 'users/comments/comment/all/' + postId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  addCommentToComment(comment): Observable<any> {
    let url = 'users/comments/comment/all';
    return this.http.post(base_url + url, JSON.stringify(comment), httpOptionsJson);
  }

  getCommentsOfPost(postId): Observable<any> {
    let url = 'users/comments/all/' + postId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  checkFavorite(check): Observable<any> {
    let url = 'users/checkFavorite';
    return this.http.post(base_url + url, check, httpOptionsJson);
  }

  addFavorite(favorite): Observable<any> {
    let url = 'users/addFavorite';
    return this.http.post(base_url + url, favorite, httpOptionsJson);
  }


  removeFavorite(favorite): Observable<any> {
    let url = 'users/removeFavorite';
    return this.http.post(base_url + url, favorite, httpOptionsJson);
  }


  spam(sign): Observable<any> {
    let url = 'users/reports';
    return this.http.post(base_url + url, JSON.stringify(sign), httpOptionsJson);
  }

}
