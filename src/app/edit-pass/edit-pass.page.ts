import { Component, OnInit } from '@angular/core';
import { MESSAGES } from '../constant/constant';
import { ToastController, MenuController } from '@ionic/angular';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-edit-pass',
  templateUrl: './edit-pass.page.html',
  styleUrls: ['./edit-pass.page.scss'],
})
export class EditPassPage implements OnInit {

  user = {
  old:'',
  new:'',
  conf:'',
  userId:''
  }

  userInfo: any
  userId =''
  loading = false
  constructor(private menuCtrl: MenuController,
    private authService: AuthService,
    private toasterController: ToastController
  ) {
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
  }

  ngOnInit() {
    this.userId = localStorage.getItem('teepzyUserId')
    this.getUserInfo(this.userId)
    this.user.userId = this.userId;
  }


  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
    //  console.log(res)
      this.userInfo = res['data'];
      
    }, error => {
    //  console.log(error)
    })
  }


  checkUserAndUpdatePass(){
    let user = {
      email: this.userInfo.email,
      password: this.user.old,
    }
    this.authService.login(user).subscribe(res =>{
      console.log(res)
      if (res['status'] ==  200) {
        if (this.user.new === this.user.conf) {
          let userPass = {
            password: this.user.new,
            userId: this.user.userId
          }
          this.updatePass(userPass)
        } else {
          this.presentToast(MESSAGES.PASSWORD_NOT_MATCH)
        }
      }
   
    }, error =>{
      console.log(error)
      if (error['status'] === 404) {
        this.presentToast(MESSAGES.PASSWORD_NOT_CORRECT)
      } else {
        this.presentToast(MESSAGES.SERVER_ERROR)
      }
    })
  }


  updatePass(user) {
    this.loading = true
    this.authService.changePassword(user).subscribe(res => {
      console.log(res)
      this.presentToast(MESSAGES.PASSWORD_UPDATED_OK)
      this.loading = false
    }, error => {
      console.log(error)
      this.presentToast(MESSAGES.SERVER_ERROR)
      this.loading = false

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
