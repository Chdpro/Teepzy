import { Component, OnInit } from "@angular/core";
import { MESSAGES } from "../constant/constant";
import { ToastController, MenuController } from "@ionic/angular";
import { AuthService } from "../providers/auth.service";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-edit-pass",
  templateUrl: "./edit-pass.page.html",
  styleUrls: ["./edit-pass.page.scss"],
})
export class EditPassPage implements OnInit {
  user = {
    old: "",
    new: "",
    conf: "",
    userId: "",
  };

  userInfo: any;
  userId = "";
  loading = false;

  hide: any;

  subscription: Subscription;
  language = "";
  constructor(
    private menuCtrl: MenuController,
    private authService: AuthService,
    private toasterController: ToastController,
    private translate: TranslateService
  ) {
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);
    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(this.language);
  }

  ngOnInit() {
    this.userId = localStorage.getItem("teepzyUserId");
    this.getUserInfo(this.userId);
    this.user.userId = this.userId;
  }

  getUserInfo(userId) {
    this.subscription = this.authService.myInfos(userId).subscribe(
      (res) => {
        //  console.log(res)
        this.userInfo = res["data"];
      },
      (error) => {
        //  console.log(error)
      }
    );
  }

  checkUserAndUpdatePass() {
    let user = {
      email: this.userInfo.email,
      password: this.user.old,
    };
    this.subscription = this.authService.login(user).subscribe(
      (res) => {
        console.log(res);
        if (res["status"] == 200) {
          if (this.user.new === this.user.conf) {
            let userPass = {
              password: this.user.new,
              userId: this.user.userId,
            };
            this.updatePass(userPass);
          } else {
            this.presentToast(
              this.language === "fr"
                ? MESSAGES.PASSWORD_NOT_MATCH
                : MESSAGES.PASSWORD_NOT_MATCH_EN
            );
          }
        }
      },
      (error) => {
        console.log(error);
        if (error["status"] === 404) {
          this.presentToast(
            this.language === "fr"
              ? MESSAGES.PASSWORD_NOT_CORRECT
              : MESSAGES.PASSWORD_NOT_CORRECT_EN
          );
        } else {
          this.presentToast(
            this.language === "fr"
              ? MESSAGES.SERVER_ERROR
              : MESSAGES.SERVER_ERROR_EN
          );
        }
      }
    );
  }

  updatePass(user) {
    this.loading = true;
    this.subscription = this.authService.changePassword(user).subscribe(
      (res) => {
        console.log(res);
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.PASSWORD_UPDATED_OK
            : MESSAGES.PASSWORD_UPDATED_OK_EN
        );
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.SERVER_ERROR
            : MESSAGES.SERVER_ERROR_EN
        );
        this.loading = false;
      }
    );
  }

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null;
  }

  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }
}
