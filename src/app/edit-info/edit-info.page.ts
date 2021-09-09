import { Component, OnInit } from "@angular/core";
import { MenuController, ToastController } from "@ionic/angular";
import { AuthService } from "../providers/auth.service";
import { MESSAGES } from "../constant/constant";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-edit-info",
  templateUrl: "./edit-info.page.html",
  styleUrls: ["./edit-info.page.scss"],
})
export class EditInfoPage implements OnInit {
  codes = [];
  user = {
    birthday: "",
    pseudoIntime: "",
    phone: "",
    email: "",
    userId: "",
    nom: "",
    prenom: "",
  };

  userInfo: any;
  userId = "";
  selected = "+33";
  userPhone = "";

  loadingA = false;
  loading = false;
  retourUsr = 0;
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
    this.listCountriesCodes();
  }

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(
      (res) => {
        //  console.log(res)
        this.userInfo = res["data"];
        this.user.pseudoIntime = this.userInfo.pseudoIntime;
        this.user.email = this.userInfo.email;
        this.user.prenom = this.userInfo.prenom;
        this.user.nom = this.userInfo.nom;
        //this.user.phone = this.userInfo.phone
        this.userPhone = this.userInfo.phone;
        this.user.birthday = this.userInfo.birthday;
      },
      (error) => {
        //  console.log(error)
      }
    );
  }

  updateInfo() {
    this.loading = true;
    this.user.phone == ""
      ? (this.user.phone = this.userInfo.phone)
      : (this.user.phone = this.selected + this.user.phone);
    this.authService.updateInfo(this.user).subscribe(
      (res) => {
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.PROFILE_UPDATED_OK
            : MESSAGES.PROFILE_UPDATED_OK_EN
        );
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  check() {
    this.loadingA = true;
    this.user.pseudoIntime = this.user.pseudoIntime
      .toLowerCase()
      .replace(/\s/g, "");
    //console.log(this.user.pseudoIntime)
    this.authService.check(this.user).subscribe(
      (res) => {
        //console.log(res)
        this.loadingA = false;

        if (res["status"] == 201) {
          this.retourUsr = 201;
        } else if (res["status"] == 404) {
          this.retourUsr = 404;
        }
      },
      (error) => {
        // console.log(error)
        this.loadingA = false;

        this.presentToast(
          this.language === "fr"
            ? MESSAGES.SERVER_ERROR
            : MESSAGES.SERVER_ERROR_EN
        );
      }
    );
  }

  listCountriesCodes() {
    this.authService.listCodes().subscribe((res) => {
      this.codes = res;
    });
  }

  updateDOBDateDeNaissance(dateObject) {
    // convert object to string then trim it to dd-mm-yyyy
    var offsetMs = dateObject.value.getTimezoneOffset() * 60000;
    let dte = new Date(dateObject.value.getTime() - offsetMs);
    this.user.birthday = dte.toISOString();
    //console.log(this.user.birthday)
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
