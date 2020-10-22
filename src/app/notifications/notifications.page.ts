import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

 
  constructor(private menuCtrl: MenuController,
    ) {
      this.menuCtrl.close('first');
      this.menuCtrl.swipeGesture(false);
    }

  ngOnInit() {
  }

}
