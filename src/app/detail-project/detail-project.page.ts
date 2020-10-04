import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-project',
  templateUrl: './detail-project.page.html',
  styleUrls: ['./detail-project.page.scss'],
})
export class DetailProjectPage implements OnInit {

  project:any
  constructor(
    private menuCtrl: MenuController,
    private route: ActivatedRoute
  ) {
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
   }

  ngOnInit() {
    this.project = this.route.snapshot.paramMap['params']
    console.log(this.project)
  }

}
