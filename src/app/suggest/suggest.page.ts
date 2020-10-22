import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { ContactService } from '../providers/contact.service';
import { MESSAGES } from '../constant/constant';

@Component({
  selector: 'app-suggest',
  templateUrl: './suggest.page.html',
  styleUrls: ['./suggest.page.scss'],
})
export class SuggestPage implements OnInit {

  
  suggest ={
    reason:'',
    userId: '',
     type: "SUGGESTION"
  }

  loading = false
 constructor(private menuCtrl: MenuController,
   private contactService : ContactService,
   private toasterController: ToastController
 ) {
   this.menuCtrl.close('first');
   this.menuCtrl.swipeGesture(false);
 }

 ngOnInit() {
   this.suggest.userId = localStorage.getItem('teepzyUserId')

 }

 suggesT(){
   this.loading = true
   console.log(this.suggest)
   this.contactService.suggest(this.suggest).subscribe(res =>{
     console.log(res)
     this.loading = false
       this.presentToast(MESSAGES.SUGGEST_OK)
   }, error =>{
     console.log(error)
     this.loading = false
     this.presentToast(MESSAGES.SERVER_ERROR)

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
