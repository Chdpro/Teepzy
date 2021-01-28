import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, } from '@angular/common/http';
import { local_url, base_url } from 'src/config';
import { Observable, of, from } from 'rxjs';
import { tuto } from '../data/tuto_data';
import { NetworkService } from './network.service';
import { Storage } from '@ionic/storage';
import { CACHE_KEYS, Offline } from '../constant/constant';


const token = localStorage.getItem('teepzyToken')

const httpOptionsJson = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    'Authorization': `${token}`,

  })
};

const API_STORAGE_KEY = 'specialkey';


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient, 
    private networkService: NetworkService,
    private storage: Storage,
    ) { }

  tutotxts(): Observable<any>{
      return of(tuto);
  
  }
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
    //console.log(JSON.stringify(invitation))
    return this.http.post(base_url + url, JSON.stringify(invitation), httpOptionsJson);
  }


  listLinksPeople(invitation): Observable<any> {
    let url = 'users/linksPeoples';
    return this.http.post(base_url + url, JSON.stringify(invitation), httpOptionsJson);
  }

  refuseLinkPeople(invitation): Observable<any> {
    let url = 'users/refuseLinkPeople';
    return this.http.post(base_url + url, JSON.stringify(invitation), httpOptionsJson);
  }


  authorizeConversationNotifications(authorize): Observable<any> {
    let url = 'users/authorizeConversationNotifications';
    return this.http.post(base_url + url,JSON.stringify(authorize), httpOptionsJson);
  }

  authorizeInvitationNotifications(authorize): Observable<any> {
    let url = 'users/authorizeInvitationNotifications';
    return this.http.post(base_url + url,JSON.stringify(authorize), httpOptionsJson);
  }

  authorizeContacts(authorize): Observable<any> {
    let url = 'users/authorizeContacts';
    return this.http.post(base_url + url,JSON.stringify(authorize), httpOptionsJson);
  }

  authorizePhotos(authorize): Observable<any> {
    let url = 'users/authorizePhotos';
    return this.http.post(base_url + url,JSON.stringify(authorize), httpOptionsJson);
  }

  acceptLinkPeople(invitation): Observable<any> {
    let url = 'users/acceptLinkPeople';
    return this.http.post(base_url + url, JSON.stringify(invitation), httpOptionsJson);
  }

  closeLinkPeople(invitation): Observable<any> {
    let url = 'users/closeLinkPeople';
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

  listInivtationViaSms(invitation): Observable<any> {
    let url = 'users/invitationsSms';
    return this.http.post(base_url + url, invitation, httpOptionsJson);
  }


  listNotification(id): Observable<any> {
    let url = 'users/notifications/' + id;
 // console.log(this.networkService.networkStatus())
    if (this.networkService.networkStatus() === Offline) {
      // Return the cached data from Storage
     return from(this.getLocalData(CACHE_KEYS.NOTIFICATIONS))
    } else {
      // Return real API data and store it locally
      return this.http.get(base_url + url, httpOptionsJson);
      //  this.setLocalData('users', res);
    }
  }

  NbrUnreadNotifications(userId): Observable<any> {
    let url = 'users/notifications/unreads/'+ userId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  markReadNotifications(userId): Observable<any> {
    let url = 'users/notifications/mark/'+ userId;
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


  deletePost(postId): Observable<any> {
    let url = 'users/post/' + postId;
    return this.http.delete(base_url + url, httpOptionsJson);
  }


  deleteRePost(postId): Observable<any> {
    let url = 'users/repost/' + postId;
    return this.http.delete(base_url + url, httpOptionsJson);
  }


  updateRePost(post): Observable<any> {
    let url = 'users/repost/update';
    return this.http.put(base_url + url, post, httpOptionsJson);
  }

  updatePost(post): Observable<any> {
    let url = 'users/post/update';
    return this.http.put(base_url + url, post, httpOptionsJson);
  }


  checkInvitationTeepzr(check): Observable<any> {
    let url = 'users/checkInvitation';
    return this.http.post(base_url + url, check, httpOptionsJson);
  }

  teepZrs(userId): Observable<any> {
    let url = 'users/teepzr/' + userId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  AllTeepZrs(userId): Observable<any> {
    let url = 'users/users/' + userId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  searchTeepZrs(search): Observable<any> {
    let url = 'users/teepzrto';
    return this.http.post(base_url + url, search, httpOptionsJson);
  }

  teepZ(userId): Observable<any> {
    let url = 'users/posts/my/' + userId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  favorites(userId): Observable<any> {
    let url = 'users/myFavorite/' + userId;
    return this.http.get(base_url + url, httpOptionsJson);
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

  deleteProject(projectId): Observable<any> {
    let url = 'users/deleteProject/' + projectId;
    return this.http.delete(base_url + url, httpOptionsJson);
  }

  addProduct(product): Observable<any> {
    let url = 'users/addProduct';
    return this.http.post(base_url + url, JSON.stringify(product), httpOptionsJson);
  }

  deleteProduct(productId): Observable<any> {
    let url = 'users/deleteProduct/' + productId;
    return this.http.delete(base_url + url, httpOptionsJson);
  }


  getPosts(userId): Observable<any> {
    let url = 'users/posts/all/' + userId;

    if (this.networkService.networkStatus() === Offline) {
      // Return the cached data from Storage
     return from(this.getLocalData(CACHE_KEYS.FEEDS))
    } else {
      // Return real API data and store it locally
      return this.http.get(base_url + url, httpOptionsJson);
      //  this.setLocalData('users', res);
    }
  }

  getContactsCached(key): Observable<any>{
    return from(this.getLocalData(key))
  }

  checkInMyCircle(check): Observable<any> {
    let url = 'users/checkInMycircle';
    return this.http.post(base_url + url,JSON.stringify(check), httpOptionsJson);
  }

  
  getPost(post): Observable<any> {
    let url = 'users/posts/apost';
    return this.http.post(base_url + url,post, httpOptionsJson);
  }


  getRePost(idTeepz): Observable<any> {
    let url = 'users/repost/' + idTeepz;
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

  SearchOnMatch(search?: any) {
    let url = 'users/searchMatch';
    return this.http.post(base_url + url, JSON.stringify(search), httpOptionsJson);
  }

  SearchInCircleOnMatch(search?: any) {
    let url = 'users/searchTeepzrsInCircle';
    return this.http.post(base_url + url, JSON.stringify(search), httpOptionsJson);
  }


  changeAccount(change?: any) {
    let url = 'users/changeAccount';
    return this.http.post(base_url + url, JSON.stringify(change), httpOptionsJson);
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

  addMessageFavorite(favorite): Observable<any> {
    let url = 'users/addMessageFavorite';
    return this.http.post(base_url + url, favorite, httpOptionsJson);
  }



  getCircleMembers(id): Observable<any> {
    let url = 'users/circle/' + id;
    return this.http.get(base_url + url, httpOptionsJson);
  }


  removeMemberFromCircle(member): Observable<any> {
    let url = 'users/removeFromCircle';
    return this.http.post(base_url + url, JSON.stringify(member), httpOptionsJson);
  }
  
  removeRoom(roomId): Observable<any> {
    let url = 'chat/deleteRoom/' + roomId;
    return this.http.delete(base_url + url, httpOptionsJson);
  }

  getRoomMembers(roomId): Observable<any> {
    let url = 'chat/members/'+ roomId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  getMembersNotInRooms(room): Observable<any> {
    let url = 'chat/nomembers';
    return this.http.post(base_url + url, room, httpOptionsJson);
  }
  

  initChatRoom(room): Observable<any> {
    let url = 'chat/';
    return this.http.post(base_url + url, room, httpOptionsJson);
  }

  getChatRoom(id): Observable<any> {
    let url = 'chat/room/'+ id;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  updateChatRoom(roomId,room): Observable<any> {
    let url = 'chat/updateRoom/' + roomId;
    return this.http.put(base_url + url, JSON.stringify(room), httpOptionsJson);
  }

  removeUserFromChatRoom(roomId,room): Observable<any> {
    let url = 'chat/removeUserRoom/' + roomId;
    return this.http.put(base_url + url, JSON.stringify(room), httpOptionsJson);
  }

  mChatRooms(id): Observable<any> {
    let url = 'chat/' + id;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  ChatRoomMessages(id): Observable<any> {
    let url = 'chat/room/' + id;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  addMessage(message): Observable<any> {
    let url = 'chat/addMessage';
    return this.http.post(base_url + url, message, httpOptionsJson);
  }

  nrbrUnreadMessages(user): Observable<any> {
    let url = 'chat/unreadMessages';
    return this.http.post(base_url + url, user, httpOptionsJson);
  }


  markReadMessages(roomInfo): Observable<any> {
    let url = 'chat/markMessageRead';
    return this.http.post(base_url + url, roomInfo, httpOptionsJson);
  }

  addReplyMessage(message): Observable<any> {
    let url = 'chat/addReplyMessage';
    return this.http.post(base_url + url, message, httpOptionsJson);
  }

  deleteMessage(message): Observable<any> {
    let url = 'chat/deleteMessage';
    return this.http.post(base_url + url, message, httpOptionsJson);
  }

  getConnected(user): Observable<any> {
    let url = 'users/getOnline';
    return this.http.post(base_url + url, user, httpOptionsJson);
  }

  removeFavorite(favorite): Observable<any> {
    let url = 'users/removeFavorite';
    return this.http.post(base_url + url, favorite, httpOptionsJson);
  }


  spam(sign): Observable<any> {
    let url = 'users/reports';
    return this.http.post(base_url + url, JSON.stringify(sign), httpOptionsJson);
  }

  report(bug): Observable<any> {
    let url = 'users/reports/bug';
    return this.http.post(base_url + url, JSON.stringify(bug), httpOptionsJson);
  }

  suggest(suggestion): Observable<any> {
    let url = 'users/suggestion';
    return this.http.post(base_url + url, JSON.stringify(suggestion), httpOptionsJson);
  }


  // listOperation(agent): Observable<any> {
  //   let url = 'transaction/transactions';
  //   if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
  //     // Return the cached data from Storage
  //     return from(this.getLocalData('transactions'));
  //   } else {
  //     // Return real API data and store it locally
  //     return this.http.post(base_url + url, agent, httpOptionsJson);
  //     //  this.setLocalData('users', res);
  //   }
  // }


  // create(transaction): Observable<any> {
  //   let url = 'transaction';
  //   if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
  //     return from(this.offlineManager.storeRequest(base_url + url, 'POST', transaction));
  //   } else {
  //     return this.http.post(base_url + url, transaction, httpOptionsJson);
  //   }
  // }

//  this.momoService.setLocalData('transactions', res);

  // Save result of API requests
  setLocalData(key, data) {
    this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
  }

  // Get cached API result
  getLocalData(key): Promise<any> {
    return  this.storage.get(`${API_STORAGE_KEY}-${key}`)
    //  .then((val) => {
    //  data = val
    //  alert("In block" + JSON.stringify(val))
    //  return data
    // });
    //alert("Out block" + JSON.stringify(data))

    
  }

}
