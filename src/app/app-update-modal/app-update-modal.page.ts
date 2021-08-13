import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-app-update-modal",
  templateUrl: "./app-update-modal.page.html",
  styleUrls: ["./app-update-modal.page.scss"],
})
export class AppUpdateModalPage implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
