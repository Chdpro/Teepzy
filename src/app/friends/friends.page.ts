import { Component, OnInit } from '@angular/core';
import { ContactService } from '../providers/contact.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  userId =''
  members = []
  loading = false
  constructor(
    private contactService: ContactService,
    private toastController:ToastController
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('teepzyUserId');
    this.getUsersOfCircle()
  }


  removeFromCircle(idMember){
    let member = {
      idCreator: this.userId, idMember: idMember
    }
    this.contactService.removeMemberFromCircle(member).subscribe(res =>{
      console.log(res)
      this.presentToast('Un membre supprimé de votre cercle')
      this.getUsersOfCircle()
    }, error =>{
      console.log(error)
    })
  }

  getUsersOfCircle() {
    this.loading = true
    this.contactService.getCircleMembers(this.userId).subscribe(res => {
      console.log(res);
      this.members = res['data']
      this.loading = false
    }, error => {
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
