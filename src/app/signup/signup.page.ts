import { Component, OnInit } from "@angular/core";
import { AuthService } from "../providers/auth.service";
import { Router } from "@angular/router";
import {
  ToastController,
  AlertController,
  LoadingController,
  MenuController,
  Platform,
} from "@ionic/angular";
import { WindowService } from "../providers/window.service";
import * as firebase from "firebase/app";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { OneSignal, OSNotificationPayload } from "@ionic-native/onesignal/ngx";
import { isCordovaAvailable } from "../../common/is-cordova-available";
import { oneSignalAppId, sender_id } from "src/config";
import { MESSAGES } from "../constant/constant";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"],
})
export class SignupPage implements OnInit {
  user = {
    email: "",
    phone: "",
    nom: "",
    prenom: "",
    photo: "",

    conf: "",
    password: "",
    playerId: "",
  };

  retourUsr: any;
  typeProfile = "";
  captchaR: any;
  loading = false;
  telephone = "";
  codes = [];

  profile: any;

  hide: any;
  hideC: any;
  showModal = "hidden";

  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;

  isLoading = false;
  selected = "+33";
  windowRef: any;
  captcha = false;

  verificationCode: string;

  profileInfo: any;

  subscription: Subscription;

  language = "en";

  languages = [
    {
      code: "en",
      language: "English",
      flag: "../../assets/img/united-kingdom.png",
    },
    { code: "fr", language: "Français", flag: "../../assets/img/france.png" },
  ];
  constructor(
    private authService: AuthService,
    public router: Router,
    public toastController: ToastController,
    private win: WindowService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    private oneSignal: OneSignal,
    private platform: Platform,
    private statusBar: StatusBar,
    private translate: TranslateService
  ) {
    this.initializeApp();

    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Register translation languages
    this.translate.addLangs(["en", "fr"]);
    // Set default language
    this.translate.setDefaultLang(this.language);
  }

  ngOnInit() {
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);
    //this.windowRef = this.win.windowRef
    //console.log(this.win.windowRef)
    //this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
    //this.windowRef.recaptchaVerifier.render()
    this.listCountriesCodes();
  }

  initializeApp() {
    //console.log(oneSignalAppId, sender_id)
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString("#ffffff");
      if (isCordovaAvailable) {
        this.oneSignal.startInit(oneSignalAppId, sender_id);
        this.oneSignal.inFocusDisplaying(
          this.oneSignal.OSInFocusDisplayOption.InAppAlert
        );
        this.oneSignal
          .handleNotificationReceived()
          .subscribe((data) => this.onPushReceived(data.payload));
        this.oneSignal.handleNotificationOpened().subscribe((data) => {
          this.onPushOpened(data.notification.payload);
          this.router.navigateByUrl("/tabs/tab2");
        });
        this.oneSignal.endInit();
        // Then You Can Get Devices ID

        this.oneSignal.getIds().then((identity) => {
          //alert(identity.pushToken + " It's Push Token");
          this.user.playerId = identity.userId;
          // alert(this.playerId)
        });
      }
    });
  }

  //Switch language
  translateLanguageTo(lang: Event) {
    this.translate.use(this.language);
    localStorage.setItem("teepzyUserLang", this.language);
  }

  private onPushOpened(payload: OSNotificationPayload) {
    // alert('Push received :' + payload.body)
  }

  private onPushReceived(payload: OSNotificationPayload) {
    // alert('Push opened: ' + payload.body)
  }

  listCountriesCodes() {
    this.authService.listCodes().subscribe((res) => {
      this.codes = res;
    });
  }

  shwModal() {
    // console.log(this.showModal)
    if (this.showModal === "hidden") {
      this.showModal = "visible";
    } else {
      this.showModal = "hidden";
    }

    if (this.user.photo != "") {
      this.presentToast("Avatar choisi ");
    }
  }

  signIn() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    const phoneNumberString = this.selected + this.telephone;
    this.user.phone = this.selected + this.telephone;
    // console.log(phoneNumberString)
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then(async (result) => {
        this.windowRef.confirmationResult = result;
        //   console.log(this.windowRef.confirmationResult)
        let alert = await this.alertCtrl.create({
          //  title: 'Enter the Confirmation code',
          inputs: [
            { name: "confirmationCode", placeholder: "Confirmation de Code" },
          ],
          buttons: [
            {
              text: "Annuler",
              handler: (data) => {},
            },
            {
              text: "Envoyer",
              handler: (data) => {
                this.verificationCode = data.confirmationCode;
                this.verifyCode();
              },
            },
          ],
        });
        await alert.present();
      })
      .catch((error) => {
        //  console.log(error)
      });
  }

  choseAvatr(url) {
    // console.log(url)
    this.user.photo = url;
  }

  verifyCode() {
    this.presentLoading();
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then((result) => {
        this.signup();
      })
      .catch((error) => {
        //    console.log(error, "Incorrect code entered?");
        this.presentToast("Incorrect code ");
      });
  }

  signup() {
    //  console.log(JSON.stringify(this.user));
    this.presentLoading();
    //  this.user.playerId = '971bc26a-e1fb-428c-8902-94d691f857eb'
    this.user.phone = this.selected + this.telephone;
    if (this.user.password == this.user.conf) {
      this.subscription = this.authService
        .signup(JSON.stringify(this.user))
        .subscribe(
          (res) => {
            //   console.log(res)
            this.retourUsr = res;
            this.profileInfo = res["data"];
            this.dismissLoading();
            if (this.retourUsr["status"] == 200) {
              this.presentToast("1ere étape passée ! Vous êtes inscrit ");
              this.loading = false;
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
              this.router.navigate(["/signup-final"], {
                replaceUrl: true,
                queryParams: this.user,
              });
              // this.obj.user = result.user;
            }
          },
          (error) => {
            //    console.log(error)
            // alert(JSON.stringify(error))
            this.loading = false;
            if (error["status"] == 403) {
              this.presentToast(MESSAGES.SIGNUP_EXIST_OK);
              this.dismissLoading();
            } else {
              this.presentToast(MESSAGES.SERVER_ERROR);
              //   alert(JSON.stringify(error))
              this.dismissLoading();
            }
          }
        );
    } else {
      this.loading = false;
      this.presentToast(MESSAGES.PASSWORD_NOT_MATCH);
      this.dismissLoading();
    }
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingCtrl
      .create({
        duration: 5000,
      })
      .then((a) => {
        a.present().then(() => {
          //  console.log('presented');
          if (!this.isLoading) {
            a.dismiss().then(() => {
              //  console.log('abort presenting')
            });
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => {
      //   console.log('dismissed')
    });
  }

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null;
  }
}
