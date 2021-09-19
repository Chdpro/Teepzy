import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { base_url, local_url } from "src/config";
import { Observable, of, from } from "rxjs";
import { tuto } from "../data/tuto_data";
import { NetworkService } from "./network.service";
import { Storage } from "@ionic/storage";
import { CACHE_KEYS, Offline } from "../constant/constant";

const token = localStorage.getItem("teepzyToken");

const httpOptionsJson = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: `${token}`,
  }),
};

const API_STORAGE_KEY = "specialkey";

@Injectable({
  providedIn: "root",
})
export class ContactService {
  constructor(
    private http: HttpClient,
    private networkService: NetworkService,
    private storage: Storage
  ) {}

  tutotxts(): Observable<any> {
    return of(tuto);
  }
  inviteViaSms(invitation): Observable<any> {
    let url = "stats/SmsInvited";
    return this.http.post(base_url + url, invitation, httpOptionsJson);
  }

  inviteToJoinCircle(invitation): Observable<any> {
    let url = "stats/inviteToJoinCircle";
    return this.http.post(
      base_url + url,
      JSON.stringify(invitation),
      httpOptionsJson
    );
  }

  cancelToJoinCircle(invitation): Observable<any> {
    let url = "stats/cancelToJoinCircle";
    return this.http.post(
      base_url + url,
      JSON.stringify(invitation),
      httpOptionsJson
    );
  }

  linkPeoples(invitation): Observable<any> {
    let url = "stats/linkPeople";
    //console.log(JSON.stringify(invitation))
    return this.http.post(
      base_url + url,
      JSON.stringify(invitation),
      httpOptionsJson
    );
  }

  listLinksPeople(invitation): Observable<any> {
    let url = "stats/linksPeoples";
    if (this.networkService.networkStatus() === Offline) {
      // Return the cached data from Storage
      return from(this.getLocalData(CACHE_KEYS.LINKS));
    } else {
      // Return real API data and store it locally
      return this.http.post(
        base_url + url,
        JSON.stringify(invitation),
        httpOptionsJson
      );
      //  this.setLocalData('stats', res);
    }
  }

  refuseLinkPeople(invitation): Observable<any> {
    let url = "stats/refuseLinkPeople";
    return this.http.post(
      base_url + url,
      JSON.stringify(invitation),
      httpOptionsJson
    );
  }

  authorizeConversationNotifications(authorize): Observable<any> {
    let url = "stats/authorizeConversationNotifications";
    return this.http.post(
      base_url + url,
      JSON.stringify(authorize),
      httpOptionsJson
    );
  }

  authorizeInvitationNotifications(authorize): Observable<any> {
    let url = "stats/authorizeInvitationNotifications";
    return this.http.post(
      base_url + url,
      JSON.stringify(authorize),
      httpOptionsJson
    );
  }

  authorizeContacts(authorize): Observable<any> {
    let url = "stats/authorizeContacts";
    return this.http.post(
      base_url + url,
      JSON.stringify(authorize),
      httpOptionsJson
    );
  }

  authorizePhotos(authorize): Observable<any> {
    let url = "stats/authorizePhotos";
    return this.http.post(
      base_url + url,
      JSON.stringify(authorize),
      httpOptionsJson
    );
  }

  acceptLinkPeople(invitation): Observable<any> {
    let url = "stats/acceptLinkPeople";
    return this.http.post(
      base_url + url,
      JSON.stringify(invitation),
      httpOptionsJson
    );
  }

  closeLinkPeople(invitation): Observable<any> {
    let url = "stats/closeLinkPeople";
    return this.http.post(
      base_url + url,
      JSON.stringify(invitation),
      httpOptionsJson
    );
  }

  acceptInvitation(invitation): Observable<any> {
    let url = "stats/acceptToJoinCircle";
    return this.http.post(base_url + url, invitation, httpOptionsJson);
  }

  listInivtation(invitation): Observable<any> {
    let url = "stats/invitations";
    if (this.networkService.networkStatus() === Offline) {
      // Return the cached data from Storage
      return from(this.getLocalData(CACHE_KEYS.INVITATIONS));
    } else {
      // Return real API data and store it locally
      return this.http.post(base_url + url, invitation, httpOptionsJson);
      //  this.setLocalData('stats', res);
    }
  }

  listInivtationViaSms(invitation): Observable<any> {
    let url = "stats/invitationsSms";
    if (this.networkService.networkStatus() === Offline) {
      // Return the cached data from Storage
      return from(this.getLocalData(CACHE_KEYS.INVITATION_SMS));
    } else {
      // Return real API data and store it locally
      return this.http.post(base_url + url, invitation, httpOptionsJson);
      //  this.setLocalData('stats', res);
    }
  }

  listNotification(id, page): Observable<any> {
    let url = `stats/notifications/` + id + `?page=${page}&limit=20`;
    // console.log(this.networkService.networkStatus())
    if (this.networkService.networkStatus() === Offline) {
      // Return the cached data from Storage
      return from(this.getLocalData(CACHE_KEYS.NOTIFICATIONS));
    } else {
      // Return real API data and store it locally
      return this.http.get(base_url + url, httpOptionsJson);
      //  this.setLocalData('stats', res);
    }
  }

  listMentionNotifications(id): Observable<any> {
    let url = `stats/notifications_mentions/` + id;
    // console.log(this.networkService.networkStatus())
    if (this.networkService.networkStatus() === Offline) {
      // Return the cached data from Storage
      return from(this.getLocalData(CACHE_KEYS.NOTIFICATIONS_MENTION));
    } else {
      // Return real API data and store it locally
      return this.http.get(base_url + url, httpOptionsJson);
      //  this.setLocalData('stats', res);
    }
  }

  NbrUnreadNotifications(userId): Observable<any> {
    let url = "stats/notifications/unreads/" + userId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  markReadNotifications(userId): Observable<any> {
    let url = "stats/notifications/mark/" + userId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  checkInviteViaSms(check): Observable<any> {
    let url = "stats/checkSmsInvitation";
    return this.http.post(base_url + url, check, httpOptionsJson);
  }

  deleteInviteViaSms(check): Observable<any> {
    let url = "stats/deleteSmsInvitation";
    return this.http.post(base_url + url, check, httpOptionsJson);
  }

  deletePost(postId, userId): Observable<any> {
    let url = "stats/post/" + postId;
    return this.http.put(base_url + url, { userId: userId }, httpOptionsJson);
  }

  updateRePost(post): Observable<any> {
    let url = "stats/repost/update";
    return this.http.put(base_url + url, post, httpOptionsJson);
  }

  updatePost(post): Observable<any> {
    let url = "stats/post/update";
    return this.http.put(base_url + url, post, httpOptionsJson);
  }

  checkInvitationTeepzr(check): Observable<any> {
    let url = "stats/checkInvitation";
    return this.http.post(base_url + url, check, httpOptionsJson);
  }

  checkInvitationNotAccepted(check): Observable<any> {
    let url = "stats/checkInvitationNotAccepted";
    return this.http.post(base_url + url, check, httpOptionsJson);
  }

  teepZrs(userId): Observable<any> {
    let url = "stats/teepzr/" + userId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  AllTeepZrs(userId): Observable<any> {
    let url = "stats/stats/" + userId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  searchTeepZrs(search): Observable<any> {
    let url = "stats/teepzrto";
    return this.http.post(base_url + url, search, httpOptionsJson);
  }

  teepZ(userId): Observable<any> {
    let url = "stats/posts/my/" + userId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  favorites(userId): Observable<any> {
    let url = "stats/myFavorite/" + userId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  eventualKnownTeepZrs(userId): Observable<any> {
    let url = "stats/teepzr/eventualsTeepzrs/" + userId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  addPost(post): Observable<any> {
    let url = "stats/posts";
    return this.http.post(
      base_url + url,
      JSON.stringify(post),
      httpOptionsJson
    );
  }

  addViewOnPost(post): Observable<any> {
    let url = "stats/post/view";
    return this.http.post(
      base_url + url,
      JSON.stringify(post),
      httpOptionsJson
    );
  }

  scopeCountOnPost(postId, userId): Observable<any> {
    let url = "stats/post/scope";
    return this.http.post(
      base_url + url,
      JSON.stringify({ postId: postId, userId: userId }),
      httpOptionsJson
    );
  }

  uploadBase64(image): Observable<any> {
    let url = "upload-avatar-base64";
    return this.http.post(base_url + url, image, httpOptionsJson);
  }

  rePost(post): Observable<any> {
    let url = "stats/reposts";
    return this.http.post(
      base_url + url,
      JSON.stringify(post),
      httpOptionsJson
    );
  }

  addRePost(post): Observable<any> {
    let url = "stats/reposts";
    return this.http.post(
      base_url + url,
      JSON.stringify(post),
      httpOptionsJson
    );
  }

  addProject(project): Observable<any> {
    let url = "stats/addProject";
    return this.http.post(
      base_url + url,
      JSON.stringify(project),
      httpOptionsJson
    );
  }

  deleteProject(projectId): Observable<any> {
    let url = "stats/deleteProject/" + projectId;
    return this.http.delete(base_url + url, httpOptionsJson);
  }

  addProduct(product): Observable<any> {
    let url = "stats/addProduct";
    return this.http.post(
      base_url + url,
      JSON.stringify(product),
      httpOptionsJson
    );
  }

  deleteProduct(productId): Observable<any> {
    let url = "stats/deleteProduct/" + productId;
    return this.http.delete(base_url + url, httpOptionsJson);
  }

  getPosts(userId): Observable<any> {
    let url = "stats/posts/all/" + userId;
    if (this.networkService.networkStatus() === Offline) {
      // Return the cached data from Storage
      return from(this.getLocalData(CACHE_KEYS.FEEDS));
    } else {
      // Return real API data and store it locally
      return this.http.get(base_url + url, httpOptionsJson);
      //  this.setLocalData('stats', res);
    }
  }

  getPostsOnFeed(userId, page?): Observable<any> {
    let url = "stats/posts/all/" + userId + `?page=${page}&limit=20`;
    if (this.networkService.networkStatus() === Offline) {
      // Return the cached data from Storage
      return from(this.getLocalData(CACHE_KEYS.FEEDS));
    } else {
      // Return real API data and store it locally
      return this.http.get(base_url + url, httpOptionsJson);
      //  this.setLocalData('stats', res);
    }
  }

  getContactsCached(key): Observable<any> {
    return from(this.getLocalData(key));
  }

  checkInMyCircle(check): Observable<any> {
    let url = "stats/checkInMycircle";
    return this.http.post(
      base_url + url,
      JSON.stringify(check),
      httpOptionsJson
    );
  }

  getPost(post): Observable<any> {
    let url = "stats/posts/apost";
    return this.http.post(base_url + url, post, httpOptionsJson);
  }

  getRePost(idTeepz): Observable<any> {
    let url = "stats/repost/" + idTeepz;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  getSocials(): Observable<any> {
    let url = "socials/";
    return this.http.get(base_url + url, httpOptionsJson);
  }

  getUsersMatch(userId): Observable<any> {
    let url = "stats/users/" + userId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  SearchOnMatch(search?: any) {
    let url = "stats/searchMatch";
    return this.http.post(
      base_url + url,
      JSON.stringify(search),
      httpOptionsJson
    );
  }

  SearchInCircleOnMatch(search?: any) {
    let url = "stats/searchTeepzrsInCircle";
    return this.http.post(
      base_url + url,
      JSON.stringify(search),
      httpOptionsJson
    );
  }

  changeAccount(change?: any) {
    let url = "stats/changeAccount";
    return this.http.post(
      base_url + url,
      JSON.stringify(change),
      httpOptionsJson
    );
  }

  addCommentToPost(comment): Observable<any> {
    let url = "stats/comments/all";
    return this.http.post(
      base_url + url,
      JSON.stringify(comment),
      httpOptionsJson
    );
  }

  getCommentsOfComment(postId): Observable<any> {
    let url = "stats/comments/comment/all/" + postId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  addCommentToComment(comment): Observable<any> {
    let url = "stats/comments/comment/all";
    return this.http.post(
      base_url + url,
      JSON.stringify(comment),
      httpOptionsJson
    );
  }

  getCommentsOfPost(postId): Observable<any> {
    let url = "stats/comments/all/" + postId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  checkFavorite(check): Observable<any> {
    let url = "stats/checkFavorite";
    return this.http.post(base_url + url, check, httpOptionsJson);
  }

  feedsFromLocal(): Observable<any> {
    return from(this.getLocalData(CACHE_KEYS.FEEDS_CHECK));
  }

  notificationsFromLocal(): Observable<any> {
    return from(this.getLocalData(CACHE_KEYS.NOTIFICATIONS));
  }

  mentionsFromLocal(): Observable<any> {
    return from(this.getLocalData(CACHE_KEYS.NOTIFICATIONS_MENTION));
  }

  addFavorite(favorite): Observable<any> {
    let url = "stats/addFavorite";
    return this.http.post(base_url + url, favorite, httpOptionsJson);
  }

  addMessageFavorite(favorite): Observable<any> {
    let url = "stats/addMessageFavorite";
    return this.http.post(base_url + url, favorite, httpOptionsJson);
  }

  getCircleMembers(id): Observable<any> {
    let url = "stats/circle/" + id;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  removeMemberFromCircle(member): Observable<any> {
    let url = "stats/removeFromCircle";
    return this.http.post(
      base_url + url,
      JSON.stringify(member),
      httpOptionsJson
    );
  }

  removeRoomByInitiator(roomId): Observable<any> {
    let url = "chat/deleteRoomInitiator/" + roomId;
    return this.http.put(base_url + url, httpOptionsJson);
  }

  removeRoomByConnectedUser(roomId): Observable<any> {
    let url = "chat/deleteRoomConnectedUser/" + roomId;
    return this.http.put(base_url + url, httpOptionsJson);
  }

  restoreRoomByConnectedUser(roomId): Observable<any> {
    let url = "chat/restoreRoomConnectedUser/" + roomId;
    return this.http.put(base_url + url, httpOptionsJson);
  }
  restoreRoomByInitiator(roomId): Observable<any> {
    let url = "chat/restoreRoomInitiator/" + roomId;
    return this.http.put(base_url + url, httpOptionsJson);
  }

  getRoomMembers(roomId): Observable<any> {
    let url = "chat/members/" + roomId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  getMembersNotInRooms(room): Observable<any> {
    let url = "chat/nomembers";
    return this.http.post(base_url + url, room, httpOptionsJson);
  }

  initChatRoom(room): Observable<any> {
    let url = "chat/";
    return this.http.post(base_url + url, room, httpOptionsJson);
  }

  getChatRoom(id): Observable<any> {
    let url = "chat/room/" + id;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  updateChatRoom(roomId, room): Observable<any> {
    let url = "chat/updateRoom/" + roomId;
    return this.http.put(base_url + url, JSON.stringify(room), httpOptionsJson);
  }

  removeUserFromChatRoom(roomId, room): Observable<any> {
    let url = "chat/removeUserRoom/" + roomId;
    return this.http.put(base_url + url, JSON.stringify(room), httpOptionsJson);
  }

  mChatRooms(id): Observable<any> {
    let url = "chat/" + id;
    if (this.networkService.networkStatus() === Offline) {
      // Return the cached data from Storage
      return from(this.getLocalData(CACHE_KEYS.ROOMS));
    } else {
      // Return real API data and store it locally
      return this.http.get(base_url + url, httpOptionsJson);
      //  this.setLocalData('stats', res);
    }
  }

  ChatRoomMessages(obj): Observable<any> {
    let url = "chat/room/messages";
    if (this.networkService.networkStatus() === Offline) {
      // Return the cached data from Storage
      return from(this.getLocalData(CACHE_KEYS.CHAT + obj.roomId));
    } else {
      // Return real API data and store it locally
      return this.http.post(base_url + url, obj, httpOptionsJson);
      //  this.setLocalData('stats', res);
    }
  }

  addMessage(message): Observable<any> {
    let url = "chat/addMessage";
    return this.http.post(base_url + url, message, httpOptionsJson);
  }

  nrbrUnreadMessages(user): Observable<any> {
    let url = "chat/unreadMessages";
    return this.http.post(base_url + url, user, httpOptionsJson);
  }

  markReadMessages(roomInfo): Observable<any> {
    let url = "chat/markMessageRead";
    return this.http.post(base_url + url, roomInfo, httpOptionsJson);
  }

  addReplyMessage(message): Observable<any> {
    let url = "chat/addReplyMessage";
    return this.http.post(base_url + url, message, httpOptionsJson);
  }

  deleteMessage(message): Observable<any> {
    let url = "chat/deleteMessage";
    return this.http.post(base_url + url, message, httpOptionsJson);
  }

  getConnected(user): Observable<any> {
    let url = "stats/getOnline";
    return this.http.post(base_url + url, user, httpOptionsJson);
  }

  likers(postId): Observable<any> {
    let url = "stats/likers/" + postId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  sharers(postId): Observable<any> {
    let url = "stats/sharers/" + postId;
    return this.http.get(base_url + url, httpOptionsJson);
  }

  removeFavorite(favorite): Observable<any> {
    let url = "stats/removeFavorite";
    return this.http.post(base_url + url, favorite, httpOptionsJson);
  }

  spam(sign): Observable<any> {
    let url = "stats/reports";
    return this.http.post(
      base_url + url,
      JSON.stringify(sign),
      httpOptionsJson
    );
  }

  report(bug): Observable<any> {
    let url = "stats/reports/bug";
    return this.http.post(base_url + url, JSON.stringify(bug), httpOptionsJson);
  }

  suggest(suggestion): Observable<any> {
    let url = "stats/suggestion";
    return this.http.post(
      base_url + url,
      JSON.stringify(suggestion),
      httpOptionsJson
    );
  }

  getAppVersion(): Observable<any> {
    let url = "stats/recent";
    return this.http.get(base_url + url, httpOptionsJson);
  }

  // listOperation(agent): Observable<any> {
  //   let url = 'transaction/transactions';
  //   if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
  //     // Return the cached data from Storage
  //     return from(this.getLocalData('transactions'));
  //   } else {
  //     // Return real API data and store it locally
  //     return this.http.post(base_url + url, agent, httpOptionsJson);
  //     //  this.setLocalData('stats', res);
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
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }
}
