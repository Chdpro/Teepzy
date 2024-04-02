import { Component, OnInit } from "@angular/core";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { Router } from "@angular/router";
import { PERMISSION } from "../constant/constant";
import { Platform } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-permissions",
  templateUrl: "./permissions.page.html",
  styleUrls: ["./permissions.page.scss"],
})
export class PermissionsPage implements OnInit {
  androidPermissionsList = [];

  constructor(
    private androidPermissions: AndroidPermissions,
    public router: Router,
    private platform: Platform,
    private translate: TranslateService
  ) {
    let language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(language);
  }

  ngOnInit() {}

  requestCameraPermissions() {
    // Change this array to conform with the permissions you need
    const androidPermissionsList = [this.androidPermissions.PERMISSION.CAMERA];

    return this.androidPermissions.requestPermission(androidPermissionsList[0]);
  }
  requestContactsPermissions() {
    // Change this array to conform with the permissions you need
    const androidPermissionsList = [
      this.androidPermissions.PERMISSION.READ_CONTACTS,
      this.androidPermissions.PERMISSION.WRITE_CONTACTS,
    ];

    return this.androidPermissions.requestPermissions(androidPermissionsList);
  }
  requestStoragePermissions() {
    // Change this array to conform with the permissions you need
    const androidPermissionsList = [
      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
      this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
    ];

    return this.androidPermissions.requestPermissions(androidPermissionsList);
  }

  requestPermissions() {
    let cameraPermitted = localStorage.getItem(PERMISSION.CAMERA);
    this.platform.ready().then(() => {
      if (cameraPermitted === null || cameraPermitted === "null") {
        this.requestCameraPermissions().then(
          (result) => {
            if (result.hasPermission === true) {
              localStorage.setItem(PERMISSION.CAMERA, PERMISSION.CAMERA);
              this.androidPermissionsList.push(PERMISSION.CAMERA);
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
                    this.requestStoragePermissions().then(
                      (resultStorage) => {
                        if (resultStorage.hasPermission === true) {
                          localStorage.setItem(
                            PERMISSION.WRITE_EXTERNAL_STORAGE,
                            PERMISSION.WRITE_EXTERNAL_STORAGE
                          );
                          localStorage.setItem(
                            PERMISSION.READ_EXTERNAL_STORAGE,
                            PERMISSION.READ_EXTERNAL_STORAGE
                          );
                          this.androidPermissionsList.push(
                            PERMISSION.WRITE_EXTERNAL_STORAGE
                          );
                          this.androidPermissionsList.push(
                            PERMISSION.READ_EXTERNAL_STORAGE
                          );
                          if (this.androidPermissionsList.length === 5) {
                            this.router.navigateByUrl("/contacts", {
                              replaceUrl: true,
                            });
                          }
                        } else {
                          let checkStorageRefuse = localStorage.getItem(
                            "StorageRefuseCounter"
                          );
                          checkStorageRefuse === null ||
                          checkStorageRefuse === "null" ||
                          checkStorageRefuse === undefined
                            ? localStorage.setItem("StorageRefuseCounter", "1")
                            : null;
                          checkStorageRefuse === "1"
                            ? localStorage.setItem("StorageRefuseCounter", "2")
                            : null;
                          checkStorageRefuse === "2"
                            ? this.router.navigateByUrl("/tabs/tab1")
                            : null;
                        }
                      },
                      (error) => {}
                    );
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
                    checkContactRefuse === "2"
                      ? this.router.navigateByUrl("/tabs/tab1")
                      : null;
                  }
                },
                (error) => {}
              );
            } else {
              let checkCamRefuse = localStorage.getItem("CamRefuseCounter");
              checkCamRefuse === null ||
              checkCamRefuse === "null" ||
              checkCamRefuse === undefined
                ? localStorage.setItem("CamRefuseCounter", "1")
                : null;
              checkCamRefuse === "1"
                ? localStorage.setItem("CamRefuseCounter", "2")
                : null;
              checkCamRefuse === "2"
                ? this.router.navigateByUrl("/tabs/tab1")
                : null;
            }
          },
          (error) => {}
        );
      } else {
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
                this.requestStoragePermissions().then(
                  (resultStorage) => {
                    if (resultStorage.hasPermission === true) {
                      localStorage.setItem(
                        PERMISSION.WRITE_EXTERNAL_STORAGE,
                        PERMISSION.WRITE_EXTERNAL_STORAGE
                      );
                      localStorage.setItem(
                        PERMISSION.READ_EXTERNAL_STORAGE,
                        PERMISSION.READ_EXTERNAL_STORAGE
                      );
                      this.androidPermissionsList.push(
                        PERMISSION.WRITE_EXTERNAL_STORAGE
                      );
                      this.androidPermissionsList.push(
                        PERMISSION.READ_EXTERNAL_STORAGE
                      );
                      if (this.androidPermissionsList.length === 5) {
                        this.router.navigateByUrl("/contacts", {
                          replaceUrl: true,
                        });
                      }
                    } else {
                      let checkStorageRefuse = localStorage.getItem(
                        "StorageRefuseCounter"
                      );
                      checkStorageRefuse === null ||
                      checkStorageRefuse === "null" ||
                      checkStorageRefuse === undefined
                        ? localStorage.setItem("StorageRefuseCounter", "1")
                        : null;
                      checkStorageRefuse === "1"
                        ? localStorage.setItem("StorageRefuseCounter", "2")
                        : null;
                      checkStorageRefuse === "2"
                        ? this.router.navigateByUrl("/tabs/tab1")
                        : null;
                    }
                  },
                  (error) => {}
                );
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
                checkContactRefuse === "2"
                  ? this.router.navigateByUrl("/tabs/tab1")
                  : null;
              }
            },
            (error) => {}
          );
        } else {
          this.requestStoragePermissions().then(
            (resultStorage) => {
              if (resultStorage.hasPermission === true) {
                localStorage.setItem(
                  PERMISSION.WRITE_EXTERNAL_STORAGE,
                  PERMISSION.WRITE_EXTERNAL_STORAGE
                );
                localStorage.setItem(
                  PERMISSION.READ_EXTERNAL_STORAGE,
                  PERMISSION.READ_EXTERNAL_STORAGE
                );
                this.androidPermissionsList.push(
                  PERMISSION.WRITE_EXTERNAL_STORAGE
                );
                this.androidPermissionsList.push(
                  PERMISSION.READ_EXTERNAL_STORAGE
                );
                if (this.androidPermissionsList.length === 5) {
                  this.router.navigateByUrl("/contacts", {
                    replaceUrl: true,
                  });
                }
              } else {
                let checkStorageRefuse = localStorage.getItem(
                  "StorageRefuseCounter"
                );
                checkStorageRefuse === null ||
                checkStorageRefuse === "null" ||
                checkStorageRefuse === undefined
                  ? localStorage.setItem("StorageRefuseCounter", "1")
                  : null;
                checkStorageRefuse === "1"
                  ? localStorage.setItem("StorageRefuseCounter", "2")
                  : null;
                checkStorageRefuse === "2"
                  ? this.router.navigateByUrl("/tabs/tab1")
                  : null;
              }
            },
            (error) => {}
          );
        }
      }
    });
  }
}
