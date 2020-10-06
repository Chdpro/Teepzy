import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-project',
  templateUrl: './detail-project.page.html',
  styleUrls: ['./detail-project.page.scss'],
})
export class DetailProjectPage implements OnInit {

  project = {
    nom:'',
    photo:'',
    description:'',
    tags: []
  }
  constructor(
    private menuCtrl: MenuController,
    private route: ActivatedRoute
  ) {
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
   }

  ngOnInit() {
    let project = this.route.snapshot.paramMap['params']
    let tags = project.tags.split(',')
    this.project.nom = project.nom 
    this.project.photo = project.photo
    this.project.description = project.description
    this.project.tags = tags
    console.log(tags)
    console.log(this.project)
  }

}
