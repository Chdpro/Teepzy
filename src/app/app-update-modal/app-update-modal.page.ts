import { Component, OnInit } from "@angular/core";
import { LoadingController, ModalController } from "@ionic/angular";
import {
  InAppBrowser,
  InAppBrowserOptions,
} from "@ionic-native/in-app-browser/ngx";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-app-update-modal",
  templateUrl: "./app-update-modal.page.html",
  styleUrls: ["./app-update-modal.page.scss"],
})
export class AppUpdateModalPage implements OnInit {
  language = "";
  constructor(
    private modalController: ModalController,
    private iab: InAppBrowser,
    private loadingController: LoadingController,
    private translate: TranslateService
  ) {
    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(this.language);
  }

  ngOnInit() {}

  goToStore() {
    /* const options: InAppBrowserOptions = {
      zoom: "no",
      fullscreen: "yes",
      hidenavigationbuttons: "no",
      toolbar: "yes",
      hideurlbar: "no",
    };
    this.iab.create(URL_PLAYSTORE, "_blank", {
      toolbar: "yes",
      hideurlbar: "no",
      fullscreen: "yes",
      location: "no",
      options,
    });*/
    this.presentLoading();
    const URL_PLAYSTORE =
      "https://play.google.com/store/apps/details?id=bsd.teepzy.com";
    const URL_APPSTORE =
      "https://apps.apple.com/bj/app/teepzy/id1572629592?l=fr";
    //window.open(URL_PLAYSTORE, "_system");
    this.iab.create(URL_PLAYSTORE, "_system");
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
