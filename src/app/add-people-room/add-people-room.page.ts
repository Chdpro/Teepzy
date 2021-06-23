import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavController, ModalController, ToastController, MenuController, NavParams } from '@ionic/angular';
import { ContactService } from '../providers/contact.service';
import { DatapasseService } from '../providers/datapasse.service';
//import { Socket } from 'ngx-socket-io';
import { MESSAGES } from '../constant/constant';

@Component({
  selector: 'app-add-people-room',
  templateUrl: './add-people-room.page.html',
  styleUrls: ['./add-people-room.page.scss'],
})
export class AddPeopleRoomPage implements OnInit {

  userId = ''
  members = []
  checkItems = {}
  membersToChatWith = []

  chatRoom = {
    name: '',
    connectedUsers: [],
    userId: '',
    _id:''
  }

  loading = false
  rooms = []
  search:any
  
  subscription: Subscription
  constructor(
    public navCtrl: NavController,
    private contactService: ContactService,
    public modalController: ModalController,
    private toasterController: ToastController,
    private dataPasse: DatapasseService,
    private menuCtrl: MenuController,
    private navParams: NavParams,
    ) { 
      this.menuCtrl.close('first');
      this.menuCtrl.swipeGesture(false);
    }
 

 
  ngOnInit() {
    let room = this.navParams.data;
    console.log(room)
    this.userId = localStorage.getItem('teepzyUserId');
    this.chatRoom.connectedUsers = room.connectedUsers
    this.chatRoom.userId = room.userId
    this.chatRoom._id = room._id
    this.getUsersOfCircle()
  }

  joinChat() {
  }

  addUserToCreateChatRoom(idUser) {
   // console.log(idUser, this.chatRoom.connectedUsers)
    if (!this.membersToChatWith.includes(idUser) && !this.chatRoom.connectedUsers.includes(idUser) ) {
      this.membersToChatWith.push(idUser)
    } else {
      this.deleteItemFromList(this.membersToChatWith, idUser)
      this.presentToast('Cette personne appartient déjà à cette discussion')

    }
   // console.log(this.membersToChatWith)
  }



  addPeopleToChatRoom() {
    this.loading = true
    this.chatRoom.connectedUsers =  this.chatRoom.connectedUsers.concat(this.membersToChatWith)
    //console.log(this.chatRoom.connectedUsers)
   this.subscription = this.contactService.updateChatRoom(this.chatRoom._id,this.chatRoom).subscribe(res => {
     // console.log(res)
      if (res['status'] == 200) {
        this.loading = false
        this.presentToast(MESSAGES.ROOM_UPDATE_OK)
        this.dataPasse.sendRoom(res['data'])
        //this.getChatRooms()
        this.dismiss()
      } else {
        this.presentToast(MESSAGES.ROOM_UPDATE_ERROR)
        this.loading = false
      }
    }, error => {
      this.loading = false
      this.presentToast(MESSAGES.ROOM_UPDATE_ERROR)
     // console.log(error)
    })
  }

  getChatRooms() {
    this.contactService.mChatRooms(this.userId).subscribe(res => {
     // console.log(res);
      this.rooms = res['data']
      this.dataPasse.send(this.rooms)

    }, error => {
    //  console.log(error)
    })
  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  getUsersOfCircle() {
    let o = {
      roomId: this.chatRoom._id,
      userId: this.userId
    }
    this.contactService.getMembersNotInRooms(o).subscribe(res => {
    //  console.log(res);
      this.members = res['data']
    }, error => {
     // console.log(error)
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
 }
}
