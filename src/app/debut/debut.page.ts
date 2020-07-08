import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-debut',
  templateUrl: './debut.page.html',
  styleUrls: ['./debut.page.scss'],
})
export class DebutPage implements OnInit {

  constructor(
    private menuCtrl: MenuController,
    private router:Router

  ) { }

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.menuCtrl.swipeGesture(false);
  }


  goToSign(){
    this.router.navigate(['/signup'], {
      replaceUrl: true,
    })
  }

  goToLogin(){
    this.router.navigate(['/login'], {
      replaceUrl: true,
    })
  }

}
