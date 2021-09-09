import { Component, OnInit } from "@angular/core";
import {
  MenuController,
  AlertController,
  ToastController,
} from "@ionic/angular";
import { ContactService } from "../providers/contact.service";
import { AuthService } from "../providers/auth.service";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { MESSAGES } from "../constant/constant";

@Component({
  selector: "app-autorisation",
  templateUrl: "./autorisation.page.html",
  styleUrls: ["./autorisation.page.scss"],
})
export class AutorisationPage implements OnInit {
  n: Boolean = true;
  nPhoto: Boolean = true;
  userId = "";
  user: any;
  subscription: Subscription;

  language = "";
  constructor(
    private menuCtrl: MenuController,
    private contactService: ContactService,
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private diagnostic: Diagnostic,
    private androidPermissions: AndroidPermissions,
    private translate: TranslateService
  ) {
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);
    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(this.language);
  }

  ngOnInit() {
    this.diagnostic.permission.READ_EXTERNAL_STORAGE;
    this.diagnostic.permission.WRITE_EXTERNAL_STORAGE;
    this.diagnostic.permission.READ_CONTACTS;
    this.userId = localStorage.getItem("teepzyUserId");
    this.getUserInfo(this.userId);
  }

  getUserInfo(userId) {
    this.subscription = this.authService.myInfos(userId).subscribe(
      (res) => {
        //  console.log(res)
        this.user = res["data"];
        this.n = this.user.isContactAuthorized;
        this.nPhoto = this.user.isPhotoAuthorized;
      },
      (error) => {
        // console.log(error)
      }
    );
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: this.language === "fr" ? MESSAGES.NOT_AUTH : MESSAGES.NOT_AUTH_EN,
      message: "",
      buttons: [
        {
          text: this.language === "fr" ? "Annuler" : "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            this.n = true;
            this.presentToast(this.language === "fr" ? "Annulé" : "Canceled");
          },
        },

        {
          text: this.language === "fr" ? "Confirmer" : "Confirm",
          handler: () => {
            this.n = false;
            this.authorizeOrNot(this.n);
          },
        },
      ],
    });
    await alert.present();
  }

  async presentPhotoAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: this.language === "fr" ? MESSAGES.NOT_AUTH : MESSAGES.NOT_AUTH_EN,
      message: "",
      buttons: [
        {
          text: this.language === "fr" ? "Annuler" : "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            this.nPhoto = true;
            this.presentToast(this.language === "fr" ? "Annulé" : "Cancel");
          },
        },

        {
          text: this.language === "fr" ? "Confirmer" : "Confirm",
          handler: () => {
            this.nPhoto = false;
            this.authorizePhotoOrNot(this.nPhoto);
          },
        },
      ],
    });
    await alert.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }

  requestNecessaryPermissions() {
    // Change this array to conform with the permissions you need
    const androidPermissionsList = [
      this.androidPermissions.PERMISSION.READ_CONTACTS,
      this.androidPermissions.PERMISSION.WRITE_CONTACTS,
    ];
    return this.androidPermissions.requestPermissions(androidPermissionsList);
  }

  authPhotoOrNot() {
    if (this.nPhoto == true) {
      this.presentPhotoAlertConfirm();
    } else {
      this.authorizePhotoOrNot(this.nPhoto);
    }
  }

  authorizePhotoOrNot(n: Boolean) {
    let authorize = {
      userId: this.userId,
      isPhotoAuthorized: n,
    };
    this.subscription = this.contactService
      .authorizePhotos(authorize)
      .subscribe(
        (res) => {
          console.log(res);
          this.user = res["data"];
          this.nPhoto = n;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  authOrNot() {
    if (this.n == true) {
      this.presentAlertConfirm();
    } else {
      this.n = true;
      if (
        this.diagnostic.permissionStatus.DENIED_ALWAYS ||
        this.diagnostic.permissionStatus.DENIED ||
        this.diagnostic.permissionStatus.DENIED_ONCE
      ) {
        this.requestNecessaryPermissions().then(
          () => {
            this.diagnostic.requestContactsAuthorization();
            //     this.diagnostic.requestRuntimePermission()
          },
          (error) => {
            this.requestNecessaryPermissions();
          }
        );
      }

      this.authorizeOrNot(this.n);
    }
  }

  authorizeOrNot(n: Boolean) {
    let authorize = {
      userId: this.userId,
      isContactAuthorized: n,
    };
    this.subscription = this.contactService
      .authorizeContacts(authorize)
      .subscribe(
        (res) => {
          console.log(res);
          this.user = res["data"];
          this.n = n;
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
