import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, MenuController, ModalController, IonRouterOutlet } from '@ionic/angular';
import { AuthService } from '../providers/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Globals } from '../globals';
import { ContactService } from '../providers/contact.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.page.html',
  styleUrls: ['./edit-post.page.scss'],
})
export class EditPostPage implements OnInit {

  userId = ''
  user:any
  post:any

  constructor(
    private authService: AuthService,
    private toasterController: ToastController,
    public alertController: AlertController,
    private menuCtrl: MenuController,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private router: Router,
    private globals: Globals,
    public route: ActivatedRoute,
    private contactService: ContactService
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('teepzyUserId');
    this.getUserInfo(this.userId)
    let idTeepz = this.route.snapshot.paramMap.get('idTeepz')
    this.getAPost(idTeepz)
    this.getRepost(idTeepz)
  }

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
      console.log(res)
      this.user = res['data'];
    }, error => {
      console.log(error)
    })
  }


  getAPost(idTeepz) {
    this.contactService.getPost(idTeepz).subscribe(res => {
      console.log(res)
      this.post = res['data'];
    }, error => {
      console.log(error)
    })

  }

  getRepost(idTeepz) {
    this.contactService.getRePost(idTeepz).subscribe(res => {
      console.log(res)
      console.log('repost!!!')
      this.post == null ? this.post = res['data'] : null;
    }, error => {
      console.log(error)
    })
  }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: "Confirmer modification ?",
      message: '',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.presentToast('Annulé')
          }
        },

        {
          text: 'Oui',
          handler: () => {
            this.update()
          }
        },

      ]
    });
    await alert.present();

  }


  update(){
    this.post.postId ? this.editRePost() : this.editPost()
  }

  editPost() {
    let post = {
      postId: this.post.postId,
      content: this.post.content,
      image_url: this.post.image_url,
      video_url: this.post.video_url,
      backgroundColor: this.post.backgroundColor,
    }
    this.contactService.updatePost(post).subscribe(res => {
      console.log(res)
    }, error => {
      console.log(error)
    })
  }


  editRePost() {
    let post = {
      postId: this.post.postId,
      content: this.post.content,
      image_url: this.post.image_url,
      video_url: this.post.video_url,
      backgroundColor: this.post.backgroundColor,
    }
    this.contactService.updateRePost(post).subscribe(res => {
      console.log(res)
      this.presentToast('Post modifié')
    }, error => {
      console.log(error)
      this.presentToast('Oops! une erreur est survenue')

    })
  }


  
  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

}
