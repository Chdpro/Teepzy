import { Component, OnInit } from '@angular/core';
import { ContactService } from '../providers/contact.service';
import { NavParams, ModalController, ToastController } from '@ionic/angular';
import { typeAccount } from '../constant/constant';
import { Socket } from 'ngx-socket-io';

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
  constructor(private contactService: ContactService, 
    private modalController: ModalController,
    private toastController: ToastController,
    private socket: Socket,
    private navParams: NavParams) { }

  ngOnInit() {
    this.roomId = this.navParams.data['roomId'];
    this.userId = localStorage.getItem('teepzyUserId');
    this.getMembers()
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



  sendInvitationToJoinCircle(idReceiver) {
    this.loading = true
    let invitation = {
      idSender: this.userId,
      idReceiver: idReceiver,
      typeLink: typeAccount.pseudoIntime
    }
    this.contactService.inviteToJoinCircle(invitation).subscribe(res => {
      // console.log(res)
      this.presentToast('Invitation envoyée')
      this.socket.emit('notification', 'notification');
      this.loading = false
    }, error => {
      // alert(JSON.stringify(error))
      this.presentToast('Invitation non envoyée')
      this.loading = false
    })
  }

  addUserToSendInvitation(idUser) {
     if (!this.membersToSendInvitation.includes(idUser) ) {
       this.membersToSendInvitation.push(idUser)
     } else {
       this.deleteItemFromList(this.membersToSendInvitation, idUser)
     }
   }


  deleteItemFromList(list, i) {
    // get index of object with id:37
    let removeIndex = list.map(function (item) { return item; }).indexOf(i);
    // remove object
    list.splice(removeIndex, 1);
    return list
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
