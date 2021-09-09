import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import {
  NavController,
  ModalController,
  ToastController,
  MenuController,
} from "@ionic/angular";
import { ContactService } from "../providers/contact.service";
//import { Socket } from 'ngx-socket-io';
import { DatapasseService } from "../providers/datapasse.service";
import { Subscription } from "rxjs";
import { MESSAGES } from "../constant/constant";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-circle-members",
  templateUrl: "./circle-members.page.html",
  styleUrls: ["./circle-members.page.scss"],
})
export class CircleMembersPage implements OnInit {
  userId = "";
  members = [];
  checkItems = {};
  membersToChatWith = [];

  chatRoom = {
    name: "",
    connectedUsers: [],
    userId: "",
  };

  loading = false;
  rooms = [];
  search: any;

  subscription: Subscription;

  language = "";
  constructor(
    public navCtrl: NavController,
    private router: Router,
    private contactService: ContactService,
    public modalController: ModalController,
    private toasterController: ToastController,
    private dataPasse: DatapasseService,
    private menuCtrl: MenuController,
    private translate: TranslateService //private socket: Socket
  ) {
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);
    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(this.language);
  }

  ngOnInit() {
    this.userId = localStorage.getItem("teepzyUserId");
    this.chatRoom.userId = this.userId;
    this.getUsersOfCircle();
  }

  joinChat() {}

  addUserToCreateChatRoom(idUser) {
    if (!this.membersToChatWith.includes(idUser)) {
      this.membersToChatWith.push(idUser);
    } else {
      this.deleteItemFromList(this.membersToChatWith, idUser);
    }
  }

  createChatRoom() {
    this.loading = true;
    this.chatRoom.connectedUsers = this.membersToChatWith;
    this.chatRoom.name != "" ? null : (this.chatRoom.name = "Entre nous deux");
    this.subscription = this.contactService
      .initChatRoom(this.chatRoom)
      .subscribe(
        (res) => {
          console.log(res);
          let room = res["data"];
          if (res["status"] == 200) {
            this.loading = false;
            this.presentToast(
              this.language === "fr"
                ? MESSAGES.ROOM_INITIATED_OK
                : MESSAGES.ROOM_INITIATED_OK_EN
            );
            this.dataPasse.sendRoom(res["data"]);
            room["connectedUsers"].length > 1
              ? this.gotoChatWhenGroupRoom(
                  room._id,
                  room.connectedUsers.length,
                  room.name,
                  room.userId
                )
              : this.gotoChatRoom(
                  room._id,
                  room.connectedUsersInfo.pseudoIntime,
                  room.connectedUsersInfo.photo,
                  room.connectedUsers.length,
                  room.name,
                  room.connectedUsers[0],
                  room.userId
                );
          } else if (res["status"] == 403) {
            if (this.userId === room.connectedUsers[0]) {
              this.dataPasse.sendRoom(res["data"]);
              this.contactService
                .restoreRoomByConnectedUser(room._id)
                .subscribe(
                  () => {
                    this.gotoChatRoom(
                      room._id,
                      room.connectedUsersInfo.pseudoIntime,
                      room.connectedUsersInfo.photo,
                      room.connectedUsers.length,
                      room.name,
                      room.connectedUsers[0],
                      room.userId
                    );
                    this.loading = false;
                  },
                  (error) => {}
                );
            } else if (this.userId === room.userId) {
              this.dataPasse.sendRoom(res["data"]);
              this.contactService.restoreRoomByInitiator(room._id).subscribe(
                () => {
                  this.gotoChatRoom(
                    room._id,
                    room.connectedUsersInfo.pseudoIntime,
                    room.connectedUsersInfo.photo,
                    room.connectedUsers.length,
                    room.name,
                    room.connectedUsers[0],
                    room.userId
                  );
                  this.loading = false;
                },
                (error) => {}
              );
            }
          }
        },
        (error) => {
          this.loading = false;
          this.presentToast(
            this.language === "fr"
              ? MESSAGES.ROOM_INITIATED_ERROR
              : MESSAGES.ROOM_INITIATED_ERROR_EN
          );
          // console.log(error)
        }
      );
  }

  gotoChatRoom(
    roomId,
    pseudo?: string,
    photo?: string,
    roomLength?: any,
    roomName?: any,
    connectedUserId?: string,
    userId?: string
  ) {
    this.navCtrl.navigateForward("/chat", {
      state: {
        roomId: roomId,
        pseudo: pseudo,
        photo: photo,
        roomLength: roomLength,
        roomName,
        connectedUserId: connectedUserId,
        userId: userId,
      },
    });
  }

  gotoChatWhenGroupRoom(
    roomId,
    roomLength?: any,
    roomName?: any,
    userId?: string
  ) {
    this.navCtrl.navigateForward("/chat", {
      state: {
        roomId: roomId,
        pseudo: "",
        photo: "",
        roomLength: roomLength,
        roomName,
        connectedUserId: "",
        userId: userId,
      },
    });
    // this.router.navigateByUrl('/chat')
  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  getUsersOfCircle() {
    this.loading = true;
    this.subscription = this.contactService
      .getCircleMembers(this.userId)
      .subscribe(
        (res) => {
          //console.log(res);
          this.members = res["data"];
          this.loading = false;
        },
        (error) => {
          // console.log(error)
          this.loading = false;
        }
      );
  }

  deleteItemFromList(list, i) {
    // get index of object with id:37
    let removeIndex = list
      .map(function (item) {
        return item;
      })
      .indexOf(i);
    // remove object
    list.splice(removeIndex, 1);
    return list;
  }

  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.router.navigateByUrl("/tabs/tab3");
  }

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null;
  }
}
