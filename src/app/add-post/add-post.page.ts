import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ContactService } from '../providers/contact.service';
import { AuthService } from '../providers/auth.service';
import { Tab1Page } from '../tab1/tab1.page';
import { DatapasseService } from '../providers/datapasse.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage implements OnInit {

  post = {
    userId: '',
    content: '',
    image_url: '',
    userPhoto_url: '',
    backgroundColor: '#fff'
  }

  loading =  false
  user:any
  listPosts = []

  

  constructor(public modalController: ModalController, 
    private toastController : ToastController,
    private authService: AuthService,
    private contactService: ContactService,
    private dataPass: DatapasseService
    ) { }

  ngOnInit() {
    this.post.userId = localStorage.getItem('teepzyUserId');
    this.getUserInfo(this.post.userId)

  }

  

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
      console.log(res)
      this.user = res['data'];
    }, error =>{
      console.log(error)
    })
  }



  getPosts(userId) {
    this.contactService.getPosts(userId).subscribe(res => {
      console.log(res)
      this.listPosts = res['data']
      this.dataPass.sendPosts(this.listPosts);  
    }, error =>{
      console.log(error)
    })
  }

  addPost(){
    this.loading =  true
    this.post.userPhoto_url = this.user.photo
    console.log(this.post);

    this.contactService.addPost(this.post).subscribe(res =>{
      console.log(res);
      this.loading =  false
      if (res['status'] == 200) {
        this.getPosts(this.post.userId)
        this.presentToast('Demande publiée')
        this.dismiss()
      }
    }, error =>{
      console.log(error)
      this.loading =  false
      this.presentToast('Oops! une erreur est survenue')

    })
  }

  setBackgroundColor(color: string) {
    console.log(color)
    this.post.backgroundColor = color;
    this.presentToast('couleur sélectionnée')
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
