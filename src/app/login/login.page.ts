import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { Router } from '@angular/router';
import { ToastController, LoadingController, MenuController } from '@ionic/angular';
import { ContactService } from '../providers/contact.service';
import { MESSAGES } from '../constant/constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user = {
    email: '',
    password: '',
  }
  retoutUsr: any;

  loading = false;
  retourUsr: any
  profileInfo: any
  constructor(
    private authService: AuthService,
    public router: Router,
    public toastController: ToastController,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    private contactService: ContactService

  ) { }

  ngOnInit() {

    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);

  }


  auth() {
    this.presentLoading()
    this.authService.login(this.user).subscribe(res => {
     // console.log(res)
      this.retourUsr = res;
      this.profileInfo = res['data']
      this.dismissLoading()
      if (this.retourUsr['status'] == 200) {
        this.presentToast(MESSAGES.LOGIN_OK)
        localStorage.setItem('teepzyUserId', this.profileInfo['userI']['_id'])
        localStorage.setItem('teepzyToken', this.profileInfo['token'])
        localStorage.setItem('teepzyEmail', this.profileInfo['userI']['email'])
        localStorage.setItem('teepzyPhone', this.profileInfo['userI']['phone'])
        let id = localStorage.getItem('teepzyUserId')
        let user = {
          userId: id,
          isOnline: true
        }
        this.contactService.getConnected(user).subscribe(res => {
       //   console.log(res)
        })
        localStorage.setItem('FinalStepCompleted', 'FinalStepCompleted')
        this.router.navigateByUrl('/contacts', {
          replaceUrl: true
        })
      }
    }, error => {
      //console.log(error['status'])
      if (error['status'] === 404) {
        this.presentToast(MESSAGES.LOGIN_INVALID)
        this.dismissLoading()

      } else {
        this.presentToast(MESSAGES.LOGIN_ERROR)
        this.dismissLoading()
      }

    })
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }


  async presentLoading() {
    this.loading = true;
    return await this.loadingCtrl.create({
      duration: 5000,
    }).then(a => {
      a.present().then(() => {
        //console.log('presented');
        if (!this.loading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismissLoading() {
    this.loading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }
}
