import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { ToastController, LoadingController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-signup-final',
  templateUrl: './signup-final.page.html',
  styleUrls: ['./signup-final.page.scss'],
})
export class SignupFinalPage implements OnInit {
  user = {
    pseudoIntime: '',
    pseudoPro: '',
    userId: '',
    role: '',
    photo: '',
    birthday: '',

  }

  retourUsr: any
  retourUsrP = 0
  profileInfo: any
  captchaR: any
  loading = false;

  loadingA = false
  loadingP = false

  constructor(private authService: AuthService,
    public router: Router,
    public toastController: ToastController,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController
  ) { 

    
  }

  ngOnInit() {
    let usr = this.route.snapshot.queryParamMap
     console.log(usr['params'])
    this.user.photo = usr['params']['photo']
    this.user.userId = localStorage.getItem('teepzyUserId')

    this.menuCtrl.enable(false);
    this.menuCtrl.swipeGesture(false);

  }


  updateUser() {

    if ((this.user.pseudoIntime == '' && this.user.pseudoPro != '') || (this.user.pseudoIntime != '' && this.user.pseudoPro == '')) {
      this.user.pseudoIntime = this.user.pseudoIntime.toLowerCase()
      this.user.pseudoPro = this.user.pseudoPro.toLowerCase() 
      this.authService.update(this.user).subscribe(res => {
        console.log(res)
        if (res['status'] == 200) {
          this.retourUsr = true
          this.presentToast('Vous êtes bien connectés')
          this.router.navigateByUrl('/contacts', {
            replaceUrl: true
          })
        }
      }, error => {
        console.log(error)
        this.presentToast('Oops! une erreur est survenue')
      })
    }  else  if ((this.user.pseudoIntime != '' && this.user.pseudoPro != '') ) {
      this.user.pseudoIntime = this.user.pseudoIntime.toLowerCase()
      this.user.pseudoPro = this.user.pseudoPro.toLowerCase() 
        console.log(this.user.pseudoIntime)
      this.authService.update(this.user).subscribe(res => {
        console.log(res)
        if (res['status'] == 200) {
          this.retourUsr = true
          this.presentToast('Vous êtes bien connectés')
          this.router.navigateByUrl('/contacts', {
            replaceUrl: true
          })
        }
      }, error => {
        console.log(error)
        this.presentToast('Oops! une erreur est survenue')
      })
    }
    
    else {
      this.presentToast('Veuillez renseigner au moins un pseudo')
    }
  }

  updateDOBDateDeNaissance(dateObject) {
    // convert object to string then trim it to dd-mm-yyyy
    var offsetMs = dateObject.value.getTimezoneOffset() * 60000;
    let dte = new Date(dateObject.value.getTime() - offsetMs);
    this.user.birthday = dte.toISOString()
    console.log(this.user.birthday)

  }


  check() {
    this.loadingA = true
    this.user.pseudoIntime = this.user.pseudoIntime.toLowerCase()
    this.user.pseudoPro = this.user.pseudoPro.toLowerCase() 
    console.log(this.user.pseudoIntime)
    this.authService.check(this.user).subscribe(res => {
      console.log(res)
      this.loadingA = false

      if (res['status'] == 201) {
        this.retourUsr = 201
      } else if (res['status'] == 404) {
        this.retourUsr = 404
      }
    }, error => {
      console.log(error)
      this.loadingA = false

      this.presentToast('Oops! une erreur est survenue')

    })
  }

  checkP() {
    this.loadingP = true
    this.authService.check(this.user).subscribe(res => {
      console.log(res)
      this.loadingP = false
      if (res['status'] == 201) {
        this.retourUsrP = 201
      } else if (res['status'] == 404) {
        this.retourUsrP = 404
      }
    }, error => {
      console.log(error)
      this.loadingP = false
      this.presentToast('Oops! une erreur est survenue')

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
        console.log('presented');
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
