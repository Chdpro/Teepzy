import { Component, OnInit } from "@angular/core";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { Router } from "@angular/router";
import { PERMISSION } from "../constant/constant";
import { ModalController, Platform } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-permission-modal",
  templateUrl: "./permission-modal.page.html",
  styleUrls: ["./permission-modal.page.scss"],
})
export class PermissionModalPage implements OnInit {
  androidPermissionsList = [];

  constructor(
    private androidPermissions: AndroidPermissions,
    public router: Router,
    private platform: Platform,
    private modalController: ModalController,
    private translate: TranslateService
  ) {
    let language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(language);
  }

  ngOnInit() {}

  requestContactsPermissions() {
    // Change this array to conform with the permissions you need
    const androidPermissionsList = [
      this.androidPermissions.PERMISSION.READ_CONTACTS,
      this.androidPermissions.PERMISSION.WRITE_CONTACTS,
    ];

    return this.androidPermissions.requestPermissions(androidPermissionsList);
  }

  requestPermissions() {
    this.platform.ready().then(() => {
      let contactsReadPermitted = localStorage.getItem(
        PERMISSION.READ_CONTACTS
      );
      let contactsWritePermitted = localStorage.getItem(
        PERMISSION.WRITE_CONTACTS
      );
      if (!contactsReadPermitted || !contactsWritePermitted) {
        this.requestContactsPermissions().then(
          (resultContact) => {
            if (resultContact.hasPermission === true) {
              localStorage.setItem(
                PERMISSION.READ_CONTACTS,
                PERMISSION.READ_CONTACTS
              );
              localStorage.setItem(
                PERMISSION.WRITE_CONTACTS,
                PERMISSION.WRITE_CONTACTS
              );
              this.androidPermissionsList.push(PERMISSION.READ_CONTACTS);
              this.androidPermissionsList.push(PERMISSION.WRITE_CONTACTS);
            } else {
              let checkContactRefuse = localStorage.getItem(
                "ContactRefuseCounter"
              );
              checkContactRefuse === null ||
              checkContactRefuse === "null" ||
              checkContactRefuse === undefined
                ? localStorage.setItem("ContactRefuseCounter", "1")
                : null;
              checkContactRefuse === "1"
                ? localStorage.setItem("ContactRefuseCounter", "2")
                : null;
              checkContactRefuse === "2" ? this.dismiss() : null;
            }
          },
          (error) => {}
        );
      }
    });
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
