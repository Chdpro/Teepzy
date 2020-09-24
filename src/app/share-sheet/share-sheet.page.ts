import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController, AlertController } from '@ionic/angular';
import { Globals } from '../globals';
import { ContactService } from '../providers/contact.service';
import { DatapasseService } from '../providers/datapasse.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-share-sheet',
  templateUrl: './share-sheet.page.html',
  styleUrls: ['./share-sheet.page.scss'],
})
export class ShareSheetPage implements OnInit {

  post:any
  repost:any
  userId = ''
  posts = []
  timeCall = 0
  listPosts = []
  
  constructor(private modalController: ModalController, 
    private globals: Globals,
    private navParams: NavParams,
    private contactService: ContactService,
    private toastController: ToastController,
    private dataPasse: DatapasseService,
    private alertController: AlertController,
    private socialSharing: SocialSharing,

    ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('teepzyUserId');
    this.post = this.navParams.data;
  }



  sendShare() {
    this.socialSharing.share('Bonjour,  ' + '<br>' + this.post['content'], 'TeepZy', null,
      ' https://play.google.com/store/apps/details?id=com.teepzy.com').then(() => {
      }).catch((err) => {
        alert(JSON.stringify(err))
      });
  }

  rePost() {
    this.repost = {
      postId: this.post['_id'],
      fromId: this.post['userId'],
      reposterId: this.userId,
      userPhoto_url: this.post['userPhoto_url'],
      userPseudo: this.post['userPseudo'],
      content: this.post['content'],
      image_url: this.post['image_url'],
      backgroundColor: this.post['backgroundColor'],
      includedCircles: this.post['includedCircles']
    }
    this.contactService.rePost(this.repost).subscribe(res => {
      console.log(res)
      this.getPosts(this.userId)
      this.presentToast('Ce post a été publié')
      this.dismiss()
    }, error => {
      this.presentToast('Oops! une erreur est survenue')
      console.log(error)
    })
  }


  getPosts(userId) {
    this.timeCall = 1
    this.contactService.getPosts(userId).subscribe(res => {
      this.listPosts = []
      if (res['data'] != null) {
        this.posts = res['data']
        this.posts.forEach(e => {
          let favorite = {
            userId: this.userId,
            postId: e['_id'],
          }
          this.checkFavorite(favorite, e)
        });
      }

      this.timeCall = 0

    }, error => {
      console.log(error)
    })
  }



  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Pourquoi signlez-vous cette publication ?',
      message: '',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.presentToast('Annulé')
          }
        }, {
          text: 'Lorem ipsum',
          handler: () => {
            let reason = 'Inaproprié'
            this.signaler(this.post['postId'], reason)
          }
        }
        ,
        {
          text: 'Lorem ipsum',
          handler: () => {
            let reason = 'Inaproprié'
            this.signaler(this.post['postId'], reason)
          }
        }
        ,
        {
          text: 'Lorem ipsum2',
          handler: () => {
            let reason = 'Lorem ipsum2'
            this.signaler(this.post['postId'], reason)

          }
        }
      ]
    });
    await alert.present();

  }



  signaler(pId, reason) {
    let spam = {
      userId: this.userId,
      postId: pId,
      reason: reason
    }
    this.contactService.spam(spam).subscribe(res => {
      console.log(res)
      this.presentToast('Ce post a été signlé comme spam')
    }, error => {
      this.presentToast('Oops! une erreur est survenue')
      console.log(error)
    })
  }

  checkFavorite(favorite, e) {
    this.contactService.checkFavorite(favorite).subscribe(res => {
      if (res['status'] == 201) {
        this.listPosts.push(
          {
            _id: e['_id'],
            userId: e['userId'],
            userPhoto_url: e['userPhoto_url'],
            userPseudo: e['userPseudo'],
            content: e['content'],
            image_url: e['image_url'],
            video_url: e['video_url'],
            backgroundColor: e['backgroundColor'],
            includedUsers: e['includedUsers'],
            createdAt: e['createdAt'],
            reposterId: e['reposterId'],
            matches: e['matches'],
            favorite: true
          },
        )

      } else {

        this.listPosts.push(
          {
            _id: e['_id'],
            userId: e['userId'],
            userPhoto_url: e['userPhoto_url'],
            userPseudo: e['userPseudo'],
            content: e['content'],
            image_url: e['image_url'],
            video_url: e['video_url'],
            backgroundColor: e['backgroundColor'],
            includedUsers: e['includedUsers'],
            createdAt: e['createdAt'],
            reposterId: e['reposterId'],
            matches: e['matches'],
            favorite: false
          },
        )
      }
      this.dataPasse.sendPosts(this.listPosts)
    })
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
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
    this.globals .showBackground = false;
  }



}
