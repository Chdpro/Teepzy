import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-detail-project',
  templateUrl: './detail-project.page.html',
  styleUrls: ['./detail-project.page.scss'],
})
export class DetailProjectPage implements OnInit {

  constructor(
    private menuCtrl: MenuController
  ) {
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
   }

  ngOnInit() {
  }

}
