import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-link',
  templateUrl: './link.page.html',
  styleUrls: ['./link.page.scss'],
})
export class LinkPage implements OnInit {

  subscription: Subscription
  constructor(
    private router: Router,
    private menuCtrl: MenuController
  ) { 
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
  }

  ngOnInit() {
  }
  goToContacts(){
    this.router.navigate(['/contacts'], {
      replaceUrl: true,
    })
  }

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null
  }

}
