import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddPostPage } from '../add-post/add-post.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public modalController: ModalController, private router: Router) {}

  AddPostPage(){
    this.router.navigate(['/add-post'])
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddPostPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
}
