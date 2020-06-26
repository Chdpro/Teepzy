import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddPostPage } from '../add-post/add-post.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public modalController: ModalController) {}

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddPostPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
}
