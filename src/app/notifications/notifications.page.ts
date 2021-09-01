import { Component, OnInit } from "@angular/core";
import {
  MenuController,
  AlertController,
  ToastController,
} from "@ionic/angular";
import { ContactService } from "../providers/contact.service";
import { AuthService } from "../providers/auth.service";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.page.html",
  styleUrls: ["./notifications.page.scss"],
})
export class NotificationsPage implements OnInit {
  n: Boolean = true;
  n2: Boolean = true;
  userId = "";
  user: any;
  subscription: Subscription;
  constructor(
    private menuCtrl: MenuController,
    private contactService: ContactService,
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private translate: TranslateService
  ) {
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);

    let language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(language);
  }

  ngOnInit() {
    this.userId = localStorage.getItem("teepzyUserId");
    this.getUserInfo(this.userId);
  }

  getUserInfo(userId) {
    this.subscription = this.authService.myInfos(userId).subscribe(
      (res) => {
        //  console.log(res)
        this.user = res["data"];
        this.n = this.user.isConversationNotificationAuthorized;
        this.n2 = this.user.isInvitationNotificationAuthorized;
      },
      (error) => {
        // console.log(error)
      }
    );
  }

  async presentConversationAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Etes-vous sûr ne pas vouloir autoriser?",
      message: "",
      buttons: [
        {
          text: "Annuler",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            this.n = true;
            this.presentToast("Annulé");
          },
        },

        {
          text: "Confirmer",
          handler: () => {
            this.n = false;
            this.authorizeConversationOrNot(this.n);
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

  authConversationOrNot() {
    if (this.n == true) {
      this.presentConversationAlertConfirm();
    } else {
      this.n = true;
      this.authorizeConversationOrNot(this.n);
    }
  }

  authorizeConversationOrNot(n: Boolean) {
    let authorize = {
      userId: this.userId,
      isConversationNotificationAuthorized: n,
    };
    this.subscription = this.contactService
      .authorizeConversationNotifications(authorize)
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

  async presentInvitationAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Etes-vous sûr ne pas vouloir autoriser?",
      message: "",
      buttons: [
        {
          text: "Annuler",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            this.n2 = true;
            this.presentToast("Annulé");
          },
        },

        {
          text: "Confirmer",
          handler: () => {
            this.n2 = false;
            this.authorizeInvitationOrNot(this.n2);
          },
        },
      ],
    });
    await alert.present();
  }

  authInvitationOrNot() {
    if (this.n2 == true) {
      this.presentInvitationAlertConfirm();
    } else {
      this.n2 = true;
      this.authorizeInvitationOrNot(this.n2);
    }
  }

  authorizeInvitationOrNot(n: Boolean) {
    let authorize = {
      userId: this.userId,
      isInvitationNotificationAuthorized: n,
    };
    this.subscription = this.contactService
      .authorizeInvitationNotifications(authorize)
      .subscribe(
        (res) => {
          console.log(res);
          this.user = res["data"];
          this.n2 = n;
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
