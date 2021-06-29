import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-robot-alert',
  templateUrl: './robot-alert.page.html',
  styleUrls: ['./robot-alert.page.scss'],
})
export class RobotAlertPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
