import { Component, OnInit } from '@angular/core';
import { ContactService } from '../providers/contact.service';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { MESSAGES } from '../constant/constant';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  userId =''
  members = []
  loading = false
  previousUrl = ''
  search:any
  constructor(
    private contactService: ContactService,
    private toastController:ToastController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('teepzyUserId');
    this.previousUrl = this.route.snapshot.paramMap.get('previousUrl')
    let uId = this.route.snapshot.paramMap.get('idUser')
    if (!uId) {
    this.getUsersOfCircle()
    } else {
      this.userId = uId
      this.getUsersOfCircle()

    }    
  }


  trackByFn(index, item) {
    return index; // or item.id
  }

  removeFromCircle(idMember){
    let member = {
      idCreator: this.userId, idMember: idMember
    }
    this.contactService.removeMemberFromCircle(member).subscribe(res =>{
     // console.log(res)
      this.presentToast(MESSAGES.CIRCLE_MEMBER_DELETED_OK)
      this.getUsersOfCircle()
    }, error =>{
     // console.log(error)
    })
  }

  getUsersOfCircle() {
    this.loading = true
    this.contactService.getCircleMembers(this.userId).subscribe(res => {
    //  console.log(res);
      this.members = res['data']
      this.loading = false
    }, error => {
    //  console.log(error)
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
