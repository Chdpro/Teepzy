import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, NavParams } from '@ionic/angular';
import { ContactService } from '../providers/contact.service';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-link-sheet',
  templateUrl: './link-sheet.page.html',
  styleUrls: ['./link-sheet.page.scss'],
})
export class LinkSheetPage implements OnInit {

  userId = ''
  user:any
  users = []
  usersMatch = []
  usersSelected = []
  publication:any
  match = true
  loading = false

  message = ''

  constructor(private modalController: ModalController, 
    private contactService: ContactService,
    private toasterController: ToastController,
    private authService: AuthService,
    private navParams: NavParams) { }


  ngOnInit() {
    let post = this.navParams.data;
    console.log(post)
    this.userId = localStorage.getItem('teepzyUserId');
    this.getUserInfo(this.userId)
    this.getUsersToMatch()

  }

  linker(linkedUser) {
    let invitation = {
      idSender:this.publication.userId,
      idReceiver: linkedUser._id,
      typeLink: 'PRO',
      linkerId: this.userId,
      message: this.message
    }
    console.log(invitation)

    if (this.userId == this.publication.userId) {
      this.presentToast("Vous ne pouvez pas linker cette publication parce que vous en êtes l'auteur")
    }else{
      this.contactService.linkPeoples(invitation).subscribe(res => {
        console.log(res)
        this.presentToast('Vous avez linké ce post')
      }, error => {
        this.presentToast('Oops! une erreur est survenue')
        console.log(error)
      })
    }
 
  }
  checkAvailability(arr, val) {
    return arr.some(function(arrVal) {
        return val === arrVal['_id'];
    })
  }

  addLink(link){
    this.checkAvailability(this.usersSelected, link['_id']) ? null : this.usersSelected.push(link);  
  }


  validateLinks(){
    this.loading = true
    for (const uS of this.usersSelected) {
      uS['']
      this.linker(uS)
    }
    this.loading = false

  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  getUsersToMatch() {
    this.contactService.getUsersMatch(this.userId).subscribe(res => {
      console.log(res)
      this.users = res['data'];
      for (const u of this.users) {
        this.usersMatch.push({
          nom: u.nom,
          prenom: u.prenom,
          pseudoIntime: u.pseudoIntime,
          pseudoPro: u.pseudoPro,
          _id: u._id,
          match: false,
          photo: u.photo
        })
      }
    }, error => {
      console.log(error)
    })
  }

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
      console.log(res)
      this.user = res['data'];
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
