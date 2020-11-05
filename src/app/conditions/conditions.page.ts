import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.page.html',
  styleUrls: ['./conditions.page.scss'],
})
export class ConditionsPage implements OnInit {

  sanitizedURL = 'https://teepzy.com/conditions-generales-dutilisations/'
  constructor(private menuCtrl: MenuController,
    public sanitizer: DomSanitizer,

  ) {
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
  }
 

  ngOnInit() {
  }

}
