import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { Router } from '@angular/router';
import { ToastController, AlertController, Platform, LoadingController } from '@ionic/angular';
import { WindowService } from '../providers/window.service';
import * as firebase from 'firebase/app';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  user = {
    email: '',
    phone:'',
    nom:'',
    prenom:'',
    photo:''
  }

  retourUsr: any
  typeProfile = ''
  captchaR:any
  loading = false;
  telephone = ''
  codes = []
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;


  isLoading = false
  selected = '+229';
  windowRef: any;
  captcha = false;

  verificationCode: string;

  constructor(private authService: AuthService,
    public router: Router,
    public toastController: ToastController,
    private win: WindowService,
    private alertCtrl:AlertController,
    private statusBar: StatusBar,
    private loadingCtrl: LoadingController,
    
    ) { }

  ngOnInit() {
    this.windowRef = this.win.windowRef
    //console.log(this.win.windowRef)
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
    this.windowRef.recaptchaVerifier.render()
  }


  listCountriesCodes() {
    this.authService.listCodes().subscribe(res => {
      this.codes = res
    })
  }

  signIn() {  
    const appVerifier = this.windowRef.recaptchaVerifier;
    const phoneNumberString = this.selected + this.telephone;
     this.user.phone = this.selected + this.telephone;
     console.log(phoneNumberString)
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then(async result => {
        this.windowRef.confirmationResult = result;
        console.log(this.windowRef.confirmationResult)
        let alert = await this.alertCtrl.create({
          //  title: 'Enter the Confirmation code',
          inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation de Code' }],
          buttons: [
            {
              text: 'Annuler',
              handler: data => { console.log('Cancel clicked'); }
            },
            {
              text: 'Envoyer',
              handler: data => {
                this.verificationCode = data.confirmationCode
                this.verifyCode()
              }
            }
          ]
        });
        await alert.present();

      })
      .catch(error => console.log(error));


  }


  choseAvatr(url){
    console.log(url)
      this.user.photo = url;
      this.presentToast("Avatar choisi ")

  }

  verifyCode() {
    this.presentLoading()
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then(result => {
        this.presentToast('1ere étape passée ! ')
        this.router.navigate(['/signup-final'],{
          replaceUrl: true,
          queryParams: this.user, 
        })
       // this.obj.user = result.user;

      })
      .catch(error =>{
        console.log(error, "Incorrect code entered?"); 
        this.presentToast("Incorrect code ")
      } );

  }




  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

  modal(){

  }



  async presentLoading() {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      duration: 5000,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }
}


