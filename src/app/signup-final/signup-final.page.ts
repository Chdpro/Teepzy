import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-signup-final',
  templateUrl: './signup-final.page.html',
  styleUrls: ['./signup-final.page.scss'],
})
export class SignupFinalPage implements OnInit {
  user = {
    email: '',
    phone:'',
    nom:'',
    prenom:'',
    photo:'',

    pseudoIntime:'',
    pseudoPro:'',
    conf:'',
    password: '',

    role:''
  }

  retourUsr: any
  profileInfo:any
  captchaR:any
  loading = false;
  constructor(private authService: AuthService,
    public router: Router,
    public toastController: ToastController,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    
    ) { }

  ngOnInit() {
   let usr = this.route.snapshot.queryParamMap
   this.user.email = usr['params']['email']
   this.user.phone = usr['params']['phone']
   this.user.nom = usr['params']['nom']
   this.user.prenom = usr['params']['prenom']
   this.user.photo = usr['params']['photo']

   console.log(usr['params'])
  }


  signup() {
    console.log(JSON.stringify(this.user));
    this.presentLoading()
    if (this.user.password == this.user.conf) {
        this.authService.signup(JSON.stringify(this.user)).subscribe(res => {
          console.log(res)
          this.retourUsr = res;
            this.profileInfo = res['data']
            this.dismissLoading()
          if (this.retourUsr['status'] == 200) {
            this.presentToast('Inscription réussie')
            this.loading = false
            localStorage.setItem('teepzyUserId', this.profileInfo['userI']['_id'])
            localStorage.setItem('teepzyToken',this.profileInfo['token'])
            localStorage.setItem('teepzyEmail', this.profileInfo['userI']['email'])
              this.router.navigate(['/link'], {
                replaceUrl: true
              })
          }
        }, error => {
          console.log(error)
          this.loading = false;
           if (error['status'] == 403){
            this.presentToast('Ce compte existe déjà. Vérifier email ou vos pseudo')
            this.dismissLoading()
          } else {
            this.presentToast('Oops! une erreur est survenue sur le serveur')
            this.dismissLoading()

          }
  
        })

    } else {
      this.loading = false;
      this.presentToast('le mot de passe et la confirmation ne correspondent pas')
      this.dismissLoading()

    }


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
