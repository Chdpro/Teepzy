import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
})
export class PrivacyPage implements OnInit {

  sanitizedURL = 'https://teepzy.com/politique-de-confidentialite/'

  constructor(private menuCtrl: MenuController,
    public sanitizer: DomSanitizer,

  ) {
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
  }
 
  ngOnInit() {
  }




}
