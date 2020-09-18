import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-link',
  templateUrl: './link.page.html',
  styleUrls: ['./link.page.scss'],
})
export class LinkPage implements OnInit {

  constructor(
    private router: Router,
    private menuCtrl: MenuController
  ) { 
    this.menuCtrl.enable(false);

  }

  ngOnInit() {
  }
  goToContacts(){
    this.router.navigate(['/contacts'], {
      replaceUrl: true,
    })
  }

}
