import { Component, OnInit } from '@angular/core';
import { ContactService } from '../providers/contact.service';
import { ToastController, MenuController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {


  userId = ''
  invitations = []
  notifications = []

  loading = false
  constructor(
    private contactService: ContactService, 
    private menuCtrl: MenuController,
    private toastController: ToastController) {
      this.menuCtrl.enable(true);
      this.menuCtrl.swipeGesture(true);
    }



  ngOnInit(){
    this.userId = localStorage.getItem('teepzyUserId');
    this.listInvitations()
    this.listNotifications()
  }


  listInvitations(){
    let invitation  = {
      idReceiver: this.userId
    }
    this.contactService.listInivtation(invitation).subscribe(res =>{
      console.log(res)
      this.invitations = res['data']
    }, error =>{
      console.log(error)
    })
  }

  listNotifications(){
    this.contactService.listNotification(this.userId).subscribe(res =>{
      console.log(res)
      this.notifications = res['data']
    }, error =>{
      console.log(error)
    })
  }

  time(date) {
    moment.locale('fr');
    return moment(date).fromNow()
  }


  trackByFn(index, item) {
    return index; // or item.id
  }

  acceptInvitation(I){
    let invitation  = {
      idReceiver: this.userId,
      idInvitation: I['_id'],
      typeLink: I['typeLink'],
      idSender: I['senderId']
    }
    this.loading = true
    this.contactService.acceptInvitation(invitation).subscribe(res =>{
      console.log(res)
      this.loading = false
      this.listInvitations()
      this.presentToast('Vous désormais en contact')
    }, error =>{
      console.log(error)
      this.loading = false
    })
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
}

}
