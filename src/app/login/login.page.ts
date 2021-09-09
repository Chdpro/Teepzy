import { Component, OnInit } from "@angular/core";
import { AuthService } from "../providers/auth.service";
import { Router } from "@angular/router";
import {
  ToastController,
  LoadingController,
  MenuController,
} from "@ionic/angular";
import { ContactService } from "../providers/contact.service";
import { MESSAGES } from "../constant/constant";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  user = {
    email: "",
    password: "",
  };
  retoutUsr: any;

  hideC: any;
  loading = false;
  retourUsr: any;
  profileInfo: any;
  subscription: Subscription;
  language = "";
  constructor(
    private authService: AuthService,
    public router: Router,
    public toastController: ToastController,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    private contactService: ContactService,
    private translate: TranslateService
  ) {
    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(this.language);
  }

  ngOnInit() {
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);
  }

  auth() {
    this.presentLoading();
    this.subscription = this.authService.login(this.user).subscribe(
      (res) => {
        // console.log(res)
        this.retourUsr = res;
        this.profileInfo = res["data"];
        this.dismissLoading();
        if (this.retourUsr["status"] == 200) {
          this.presentToast(
            this.language === "fr" ? MESSAGES.LOGIN_OK : MESSAGES.LOGIN_OK_EN
          );
          localStorage.setItem(
            "teepzyUserId",
            this.profileInfo["userI"]["_id"]
          );
          localStorage.setItem("teepzyToken", this.profileInfo["token"]);
          localStorage.setItem(
            "teepzyEmail",
            this.profileInfo["userI"]["email"]
          );
          localStorage.setItem(
            "teepzyPhone",
            this.profileInfo["userI"]["phone"]
          );
          let id = localStorage.getItem("teepzyUserId");
          let user = {
            userId: id,
            isOnline: true,
          };
          this.subscription = this.contactService
            .getConnected(user)
            .subscribe((res) => {
              //   console.log(res)
            });
          localStorage.setItem("FinalStepCompleted", "FinalStepCompleted");
          if (this.profileInfo["userI"]["isAllProfileCompleted"] == true) {
            this.router.navigateByUrl("/contacts", {
              replaceUrl: true,
            });
          } else {
            this.router.navigateByUrl("/edit-profile", {
              replaceUrl: true,
            });
          }
        }
      },
      (error) => {
        //console.log(error['status'])
        if (error["status"] === 404) {
          this.presentToast(
            this.language === "fr"
              ? MESSAGES.LOGIN_INVALID
              : MESSAGES.LOGIN_INVALID_EN
          );
          this.dismissLoading();
        } else {
          this.presentToast(MESSAGES.LOGIN_ERROR);
          this.presentToast(
            this.language === "fr"
              ? MESSAGES.LOGIN_INVALID
              : MESSAGES.LOGIN_INVALID_EN
          );
          this.dismissLoading();
        }
      }
    );
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }

  async presentLoading() {
    this.loading = true;
    return await this.loadingCtrl
      .create({
        duration: 5000,
      })
      .then((a) => {
        a.present().then(() => {
          //console.log('presented');
          if (!this.loading) {
            a.dismiss().then(() => console.log("abort presenting"));
          }
        });
      });
  }

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null;
  }

  async dismissLoading() {
    this.loading = false;
    return await this.loadingCtrl
      .dismiss()
      .then(() => console.log("dismissed"));
  }
}
