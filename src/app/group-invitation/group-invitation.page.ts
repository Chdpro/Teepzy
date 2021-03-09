import { Component, OnInit } from '@angular/core';
import { ContactService } from '../providers/contact.service';
import { NavParams, ModalController, ToastController } from '@ionic/angular';
//import { typeAccount } from '../constant/constant';
//import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-group-invitation',
  templateUrl: './group-invitation.page.html',
  styleUrls: ['./group-invitation.page.scss'],
})
export class GroupInvitationPage implements OnInit {

  members = []
  userId = ''
  roomId = ''
  membersToSendInvitation = []
  loading = false
  search:any
  group:any
  previousUrl = ''
  constructor(private contactService: ContactService, 
    private modalController: ModalController,
    private toastController: ToastController,
  //  private socket: Socket,
    private navParams: NavParams) { }

  ngOnInit() {
    this.roomId = this.navParams.data['roomId'];
    this.userId = localStorage.getItem('teepzyUserId');
    this.getMembers()
    this.getRoom()
  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  getMembers(){
    this.contactService.getRoomMembers(this.roomId).subscribe(res =>{
      console.log(res)
      this.members = res['data']
    }, error =>{
      console.log(error)
    })
  }

  getRoom(){
    this.contactService.getChatRoom(this.roomId).subscribe(res =>{
      console.log(res)
      this.group = res['data']
      //this.members = res['data']
    }, error =>{
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

  deleteUserFromRoom(id){
    let newConnectedUsers = this.deleteItemFromList(this.group.connectedUsers,  id)
    console.log(newConnectedUsers)
    let room = {
      connectedUsers: newConnectedUsers,
    }
    console.log(room)
    this.contactService.removeUserFromChatRoom(this.roomId,  room).subscribe(res =>{
      console.log(res)
      this.getMembers()
      this.dismiss()
      this.presentToast("Membre supprimé de la conversation")
    }, error =>{
      console.log(error)
    })
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }
}
