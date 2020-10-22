import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-autorisation',
  templateUrl: './autorisation.page.html',
  styleUrls: ['./autorisation.page.scss'],
})
export class AutorisationPage implements OnInit {
  
  constructor(private menuCtrl: MenuController,
    ) {
      this.menuCtrl.close('first');
      this.menuCtrl.swipeGesture(false);
    }
   
    ngOnInit() {
    }
  

}
