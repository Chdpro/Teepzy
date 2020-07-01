import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-debut',
  templateUrl: './debut.page.html',
  styleUrls: ['./debut.page.scss'],
})
export class DebutPage implements OnInit {

  constructor(
    private menuCtrl: MenuController

  ) { }

  ngOnInit() {

    this.menuCtrl.enable(false);
    this.menuCtrl.swipeGesture(false);

  }

}
