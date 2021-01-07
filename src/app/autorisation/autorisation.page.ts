import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController, ToastController } from '@ionic/angular';
import { ContactService } from '../providers/contact.service';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-autorisation',
  templateUrl: './autorisation.page.html',
  styleUrls: ['./autorisation.page.scss'],
})
export class AutorisationPage implements OnInit {
  
  n:Boolean = true
  userId = ''
  user:any
  constructor(private menuCtrl: MenuController,
    private contactService: ContactService,
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController
    ) {
      this.menuCtrl.close('first');
      this.menuCtrl.swipeGesture(false);
    }
   
    ngOnInit() {
      this.userId = localStorage.getItem('teepzyUserId');
      this.getUserInfo(this.userId)
    }
  

    getUserInfo(userId) {
      this.authService.myInfos(userId).subscribe(res => {
        //  console.log(res)
        this.user = res['data'];
        this.n = this.user.isContactAuthorized
      }, error => {
        // console.log(error)
      })
    }

    async presentAlertConfirm() {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: "Etes-vous sûr ne pas vouloir autoriser?",
        message: '',
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              this.n = true
              this.presentToast('Annulé')
            }
          },
  
          {
            text: 'Confirmer',
            handler: () => {
              this.n = false
              this.authorizeOrNot(this.n)
  
            }
          }
        ]
      });
      await alert.present();
  
    }
    

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

  test(){
    console.log(this.n)
  }

    authOrNot(){
      if (this.n == true) {
        this.presentAlertConfirm()
      }else{
        this.n = true
        this.authorizeOrNot(this.n)
      }
    }
    authorizeOrNot(n:Boolean){
      let authorize = {
        userId: this.userId,
        isContactAuthorized: n
      }
      this.contactService.authorizeContacts(authorize).subscribe(res =>{
        console.log(res)
        this.user =  res['data']
        this.n = n
      }, error =>{
        console.log(error)
      })
    }
}
