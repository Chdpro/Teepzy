import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { AuthService } from '../providers/auth.service';
import { ContactService } from '../providers/contact.service';
import { MESSAGES } from '../constant/constant';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-report-bug',
  templateUrl: './report-bug.page.html',
  styleUrls: ['./report-bug.page.scss'],
})
export class ReportBugPage implements OnInit {

   bug ={
     reason:'',
     userId: '',
      type: "BUG"
   }

   loading = false
   subscription: Subscription
  constructor(private menuCtrl: MenuController,
    private contactService : ContactService,
    private toasterController: ToastController
  ) {
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
  }

  ngOnInit() {
    this.bug.userId = localStorage.getItem('teepzyUserId')

  }

  report(){
    this.loading = true
   this.subscription = this.contactService.report(this.bug).subscribe(res =>{
      console.log(res)
      this.loading = false
        this.presentToast(MESSAGES.REPORT_OK)
    }, error =>{
      console.log(error)
      this.loading = false

    })
  }

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null
  }
  
  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }
}
