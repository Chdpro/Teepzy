import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-robot-alert",
  templateUrl: "./robot-alert.page.html",
  styleUrls: ["./robot-alert.page.scss"],
})
export class RobotAlertPage implements OnInit {
  language = "";
  constructor(
    private modalController: ModalController,
    private translate: TranslateService
  ) {
    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(this.language);
  }

  ngOnInit() {}

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
