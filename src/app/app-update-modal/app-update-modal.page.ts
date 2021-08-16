import { Component, OnInit } from "@angular/core";
import { LoadingController, ModalController } from "@ionic/angular";
import {
  InAppBrowser,
  InAppBrowserOptions,
} from "@ionic-native/in-app-browser/ngx";

@Component({
  selector: "app-app-update-modal",
  templateUrl: "./app-update-modal.page.html",
  styleUrls: ["./app-update-modal.page.scss"],
})
export class AppUpdateModalPage implements OnInit {
  constructor(
    private modalController: ModalController,
    private iab: InAppBrowser,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  goToStore() {
    const options: InAppBrowserOptions = {
      zoom: "no",
      fullscreen: "yes",
      hidenavigationbuttons: "no",
      toolbar: "yes",
      hideurlbar: "no",
    };
    this.presentLoading();
    const URL_PLAYSTORE =
      "https://play.google.com/store/apps/details?id=bsd.teepzy.com";
    this.iab.create(URL_PLAYSTORE, "_blank", {
      toolbar: "yes",
      hideurlbar: "no",
      fullscreen: "yes",
      location: "no",
      options,
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Hellooo",
      duration: 2000,
      spinner: "bubbles",
    });
    await loading.present();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
