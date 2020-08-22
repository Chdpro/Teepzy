import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ModalController, ToastController } from '@ionic/angular';
import { ContactService } from '../providers/contact.service';
import { Socket } from 'ngx-socket-io';
import { DatapasseService } from '../providers/datapasse.service';

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
    name: 'Ma discussion',
    connectedUsers: [],
    userId: ''
  }

  loading =  false
  rooms = []

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
    this.getUsersOfCircle()
  }

  joinChat() {
  }

  addUserToCreateChatRoom() {
    for (const key in this.checkItems) {
      console.log(key);
      this.membersToChatWith.push(key)
    }
    console.log(this.membersToChatWith)
  }

  createChatRoom() {
    this.loading = true
    this.chatRoom.connectedUsers = this.membersToChatWith
    this.contactService.initChatRoom(this.chatRoom).subscribe(res =>{
      console.log(res)
      if (res['status'] == 200) {
      this.loading = false
      this.presentToast('Une discussion créee')
      this.getChatRooms()
        this.dataPasse.send(this.rooms)
      this.dismiss() 
      }else{
        this.presentToast('Cette discussion existe déjà')
        this.loading = false
      }
    }, error =>{
      this.loading = false
      this.presentToast('Oops! une erreur est survenue')
      console.log(error)
    })
  }

  getChatRooms() {
    this.contactService.mChatRooms(this.userId).subscribe(res => {
      console.log(res);
      this.rooms = res['data']
    }, error => {
      console.log(error)
    })
  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  getUsersOfCircle() {
    this.contactService.getCircleMembers(this.userId).subscribe(res => {
      console.log(res);
      this.members = res['data']
    }, error => {
      console.log(error)
    })
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

}
