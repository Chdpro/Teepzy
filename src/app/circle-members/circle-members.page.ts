import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ModalController, ToastController, MenuController } from '@ionic/angular';
import { ContactService } from '../providers/contact.service';
import { Socket } from 'ngx-socket-io';
import { DatapasseService } from '../providers/datapasse.service';
import { Subscription } from 'rxjs';
import { MESSAGES } from '../constant/constant';

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
  search:any

  subscription: Subscription
  constructor(public navCtrl: NavController,
    private router: Router,
    private contactService: ContactService,
    public modalController: ModalController,
    private toasterController: ToastController,
    private dataPasse: DatapasseService,
    private menuCtrl: MenuController,
    private socket: Socket) { 
      this.menuCtrl.close('first');
      this.menuCtrl.swipeGesture(false);
    }

  ngOnInit() {
    this.userId = localStorage.getItem('teepzyUserId');
    this.chatRoom.userId = this.userId
    this.getUsersOfCircle()
  }

  joinChat() {
  }

  addUserToCreateChatRoom(idUser) {
    if (!this.membersToChatWith.includes(idUser)) {
      this.membersToChatWith.push(idUser)
    } else {
      this.deleteItemFromList(this.membersToChatWith, idUser)
    }
   // console.log(this.membersToChatWith)
  }



  createChatRoom() {
    this.loading = true
    this.chatRoom.connectedUsers = this.membersToChatWith
    this.chatRoom.name != '' ? null : this.chatRoom.name = 'Entre nous deux'
    this.contactService.initChatRoom(this.chatRoom).subscribe(res => {
     // console.log(res)
      if (res['status'] == 200) {
        this.loading = false
        this.presentToast(MESSAGES.ROOM_INITIATED_OK)        
        this.getChatRooms()
       // this.dismiss()
      } else {
        this.presentToast(MESSAGES.ROOM_EXIST_OK)
        this.loading = false
      }
    }, error => {
      this.loading = false
      this.presentToast(MESSAGES.ROOM_INITIATED_ERROR)
     // console.log(error)
    })
  }

  getChatRooms() {
    this.contactService.mChatRooms(this.userId).subscribe(res => {
     // console.log(res);
      this.rooms = res['data']
      this.dataPasse.send(this.rooms)
      this.router.navigateByUrl('/tabs/tab3')
    }, error => {
    //  console.log(error)
    })
  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  getUsersOfCircle() {
    this.loading = true
    this.contactService.getCircleMembers(this.userId).subscribe(res => {
      //console.log(res);
      this.members = res['data']
      this.loading = false
    }, error => {
     // console.log(error)
     this.loading = false

    })
  }


  /* getUsers() {
    this.contactService.AllTeepZrs(this.userId).subscribe(res => {
      console.log(res);
      this.members = res['data']
    }, error => {
      console.log(error)
    })
  }*/


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
    this.router.navigateByUrl('/tabs/tab3')
  }


  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null
    //this.socket.removeAllListeners('message');
    //this.socket.removeAllListeners('users-changed');
  }
}
