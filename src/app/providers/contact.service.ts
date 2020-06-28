import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient,} from '@angular/common/http';
import { base_url, local_url, test_url } from 'src/config';
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
    return this.http.post(test_url + url, invitation, httpOptionsJson);
  }


  inviteToJoinCircle(invitation): Observable<any> {
    let url = 'users/inviteToJoinCircle';
    return this.http.post(test_url + url, invitation, httpOptionsJson);
  }

  checkInviteViaSms(check): Observable<any> {
    let url = 'users/checkSmsInvitation';
    return this.http.post(test_url + url, check, httpOptionsJson);
  }
  checkInvitationTeepzr(check): Observable<any> {
    let url = 'users/checkInvitation';
    return this.http.post(test_url + url, check, httpOptionsJson);
  }

  teepZrs(userId): Observable<any> {
    let url = 'users/teepzr/' + userId;
    return this.http.get(test_url + url, httpOptionsJson);
  }

  eventualKnownTeepZrs(userId): Observable<any> {
    let url = 'users/teepzr/eventualsTeepzrs/' + userId;
    return this.http.get(test_url + url, httpOptionsJson);
  }
  

  addPost(post): Observable<any> {
    let url = 'users/posts';
    return this.http.post(local_url + url, JSON.stringify(post), httpOptionsJson);
  }

  getPosts(userId): Observable<any> {
    let url = 'users/posts/all/' + userId;
    return this.http.get(local_url + url, httpOptionsJson);
  }


  addCommentToPost(comment): Observable<any> {
    let url = 'users/comments/all';
    return this.http.post(local_url + url, JSON.stringify(comment), httpOptionsJson);
  }

  getCommentsOfPost(postId): Observable<any> {
    let url = 'users/comments/all/' + postId;
    return this.http.get(local_url + url, httpOptionsJson);
  }

  checkFavorite(check): Observable<any> {
    let url = 'users/checkFavorite';
    return this.http.post(local_url + url, check, httpOptionsJson);
  }

  addFavorite(favorite): Observable<any> {
    let url = 'users/addFavorite';
    return this.http.post(local_url + url, favorite, httpOptionsJson);
  }

}
