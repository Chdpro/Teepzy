import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { AuthService } from '../providers/auth.service';
import { MESSAGES } from '../constant/constant';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.page.html',
  styleUrls: ['./edit-info.page.scss'],
})
export class EditInfoPage implements OnInit {

  codes = []
  user = {
    birthday: '',
    pseudoIntime: '',
    phone: '',
    email: '',
    userId:''
  }

  userInfo: any
  userId =''
  selected = '+33';

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
    this.listCountriesCodes()
  }


  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
    //  console.log(res)
      this.userInfo = res['data'];
      this.user.pseudoIntime = this.userInfo.pseudoIntime
      this.user.email = this.userInfo.email
      this.user.phone = this.userInfo.phone
      this.user.birthday = this.userInfo.birthday
    }, error => {
    //  console.log(error)
    })
  }


  updateInfo() {
    this.loading = true
    this.authService.updateInfo(this.user).subscribe(res => {
      console.log(res)
      this.presentToast(MESSAGES.PROFILE_UPDATED_OK)
      this.loading = false
    }, error => {
      console.log(error)
      this.loading = false

    })
  }

  listCountriesCodes() {
    this.authService.listCodes().subscribe(res => {
      this.codes = res
    })
  }

  updateDOBDateDeNaissance(dateObject) {
    // convert object to string then trim it to dd-mm-yyyy
    var offsetMs = dateObject.value.getTimezoneOffset() * 60000;
    let dte = new Date(dateObject.value.getTime() - offsetMs);
    this.user.birthday = dte.toISOString()
    //console.log(this.user.birthday)

  }


  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }
}
