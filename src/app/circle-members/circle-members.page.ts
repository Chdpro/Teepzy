import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ModalController, ToastController } from '@ionic/angular';
import { ContactService } from '../providers/contact.service';
import { Socket } from 'ngx-socket-io';
import { DatapasseService } from '../providers/datapasse.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-circle-members',
  templateUrl: './circle-members.page.html',
  styleUrls: ['./circle-members.page.scss'],
})
export class CircleMembersPage implements OnInit {
  userId = ''
  members = []
  checkItems = {}
  membersToChatWith = []

  chatRoom = {
    name: '',
    connectedUsers: [],
    userId: ''
  }

  loading = false
  rooms = []

  subscription: Subscription
  constructor(public navCtrl: NavController,
    private router: Router,
    private contactService: ContactService,
    public modalController: ModalController,
    private toasterController: ToastController,
    private dataPasse: DatapasseService,
    private socket: Socket) { }

  ngOnInit() {
    this.userId = localStorage.getItem('teepzyUserId');
    this.chatRoom.userId = this.userId
    this.getUsers()
  }

  joinChat() {
  }

  addUserToCreateChatRoom(idUser) {
    if (!this.membersToChatWith.includes(idUser)) {
      this.membersToChatWith.push(idUser)
    } else {
      this.deleteItemFromList(this.membersToChatWith, idUser)
    }
    console.log(this.membersToChatWith)
  }



  createChatRoom() {
    this.loading = true
    this.chatRoom.connectedUsers = this.membersToChatWith
    this.chatRoom.name != '' ? null : this.chatRoom.name = 'Entre nous deux'
    this.contactService.initChatRoom(this.chatRoom).subscribe(res => {
      console.log(res)
      if (res['status'] == 200) {
        this.loading = false
        this.presentToast('Une discussion créee')
        this.getChatRooms()
        this.dismiss()
      } else {
        this.presentToast('Cette discussion existe déjà')
        this.loading = false
      }
    }, error => {
      this.loading = false
      this.presentToast('Oops! une erreur est survenue')
      console.log(error)
    })
  }

  getChatRooms() {
    this.contactService.mChatRooms(this.userId).subscribe(res => {
      console.log(res);
      this.rooms = res['data']
      this.dataPasse.send(this.rooms)

    }, error => {
      console.log(error)
    })
  }

  trackByFn(index, item) {
    return index; // or item.id
  }
/*
  getUsersOfCircle() {
    this.contactService.getCircleMembers(this.userId).subscribe(res => {
      console.log(res);
      this.members = res['data']
    }, error => {
      console.log(error)
    })
  }*/


  getUsers() {
    this.contactService.AllTeepZrs(this.userId).subscribe(res => {
      console.log(res);
      this.members = res['data']
    }, error => {
      console.log(error)
    })
  }


  deleteItemFromList(list, i) {
    // get index of object with id:37
    let removeIndex = list.map(function (item) { return item; }).indexOf(i);
    // remove object
    list.splice(removeIndex, 1);
    return list
  }



  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }


  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null
    //this.socket.removeAllListeners('message');
    //this.socket.removeAllListeners('users-changed');
  }
}
