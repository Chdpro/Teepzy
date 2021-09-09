import { Component, OnInit } from "@angular/core";
import { AuthService } from "../providers/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  ToastController,
  LoadingController,
  MenuController,
  ActionSheetController,
  ModalController,
} from "@ionic/angular";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { ContactService } from "../providers/contact.service";
import { MESSAGES } from "../constant/constant";
import { Subscription } from "rxjs";
import { UploadService } from "../providers/upload.service";
import { ImageCropPage } from "../image-crop/image-crop.page";
import { DatapasseService } from "../providers/datapasse.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-signup-final",
  templateUrl: "./signup-final.page.html",
  styleUrls: ["./signup-final.page.scss"],
})
export class SignupFinalPage implements OnInit {
  user = {
    pseudoIntime: "",
    userId: "",
    role: "",
    photo: "",
    birthday: "",
    gender: "",
  };

  userInfo: any;

  photos: any = [];
  filesName = new Array();
  dispImags = [];
  imageData;

  retourUsr: any;
  retourUsrP = 0;
  profileInfo: any;
  captchaR: any;
  loading = false;

  loadingA = false;
  loadingP = false;

  subscription: Subscription;
  myImage = "";
  language = "";
  constructor(
    private authService: AuthService,
    public router: Router,
    public toastController: ToastController,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    private camera: Camera,
    private uploadService: UploadService,
    public actionSheetController: ActionSheetController,
    private contactService: ContactService,
    private modalController: ModalController,
    private dataPass: DatapasseService,
    private translate: TranslateService
  ) {
    this.subscription = this.dataPass.getUserPhoto().subscribe((photo) => {
      if (photo) {
        this.dispImags[0] = photo;
      }
    });

    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(this.language);
  }

  ngOnInit() {
    let usr = this.route.snapshot.queryParamMap;
    this.user.photo = usr["params"]["photo"];
    this.user.userId = localStorage.getItem("teepzyUserId");
    this.getUserInfo(this.user.userId);
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);
  }

  getUserInfo(userId) {
    this.subscription = this.authService.myInfos(userId).subscribe(
      (res) => {
        //  console.log(res)
        this.userInfo = res["data"];
        this.userInfo["photo"]
          ? (this.dispImags[0] = this.userInfo["photo"])
          : null;
      },
      (error) => {
        //  console.log(error)
      }
    );
  }

  updateUser() {
    if (this.user.pseudoIntime != "") {
      this.user.pseudoIntime = this.user.pseudoIntime.toLowerCase();
      this.subscription = this.authService.update(this.user).subscribe(
        (res) => {
          //  console.log(res)
          if (res["status"] == 200) {
            this.retourUsr = true;
            this.presentToast(
              this.language === "fr"
                ? MESSAGES.PASSWORD_NOT_MATCH
                : MESSAGES.PASSWORD_NOT_MATCH_EN
            );
            localStorage.setItem("FinalStepCompleted", "FinalStepCompleted");
            let user = {
              userId: this.user.userId,
              isOnline: true,
            };
            this.subscription = this.contactService
              .getConnected(user)
              .subscribe((res) => {
                //   console.log(res)
              });
            this.router.navigateByUrl("/tuto-video", {
              replaceUrl: true,
            });
          }
        },
        (error) => {
          // console.log(error)
          this.presentToast(
            this.language === "fr"
              ? MESSAGES.SERVER_ERROR
              : MESSAGES.SERVER_ERROR_EN
          );
        }
      );
    } else {
      this.presentToast(
        this.language === "fr"
          ? "Veuillez renseigner un pseudo"
          : "Please enter a nickname"
      );
    }
  }

  updateDOBDateDeNaissance(dateObject) {
    // convert object to string then trim it to dd-mm-yyyy
    var offsetMs = dateObject.value.getTimezoneOffset() * 60000;
    let dte = new Date(dateObject.value.getTime() - offsetMs);
    this.user.birthday = dte.toISOString();
    //console.log(this.user.birthday)
  }

  check() {
    this.loadingA = true;
    this.user.pseudoIntime = this.user.pseudoIntime
      .toLowerCase()
      .replace(/\s/g, "");
    this.subscription = this.authService.check(this.user).subscribe(
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

  checkP() {
    this.loadingP = true;
    this.subscription = this.authService.check(this.user).subscribe(
      (res) => {
        // console.log(res)
        this.loadingP = false;
        if (res["status"] == 201) {
          this.retourUsrP = 201;
        } else if (res["status"] == 404) {
          this.retourUsrP = 404;
        }
      },
      (error) => {
        // console.log(error)
        this.loadingP = false;
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.SERVER_ERROR
            : MESSAGES.SERVER_ERROR_EN
        );
      }
    );
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header:
        this.language === "fr"
          ? MESSAGES.SELECT_MEDIA
          : MESSAGES.SELECT_MEDIA_EN,
      buttons: [
        {
          text:
            this.language === "fr"
              ? MESSAGES.GALLERY_CHOICE
              : MESSAGES.GALLERY_CHOICE_EN,
          handler: () => {
            this.pickImageDataUrl(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text:
            this.language === "fr"
              ? MESSAGES.CAMERA_CHOICE
              : MESSAGES.CAMERA_CHOICE_EN,
          handler: () => {
            this.pickImageDataUrl(this.camera.PictureSourceType.CAMERA);
          },
        },
        {
          text: this.language === "fr" ? "Annulé" : "Canceled",
          role: "cancel",
        },
      ],
    });
    await actionSheet.present();
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 20,
      targetWidth: 600,
      targetHeight: 600,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        // let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.dispImags[0] = (<any>window).Ionic.WebView.convertFileSrc(
          imageData
        );
        if (imageData) {
          this.imageData = imageData;
        }
      },
      (err) => {
        // Handle error
      }
    );
  }

  async presentCroppageModal(imageSelected) {
    const modal = await this.modalController.create({
      component: ImageCropPage,
      cssClass: "my-custom-class",
      componentProps: { imageSelected: imageSelected },
    });
    return await modal.present();
  }

  pickImageDataUrl(sourceType) {
    const options: CameraOptions = {
      quality: 20,
      targetWidth: 600,
      targetHeight: 600,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        // let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.myImage = "data:image/jpeg;base64," + imageData;
        this.presentCroppageModal(this.myImage);
      },
      (err) => {}
    );
  }

  upLoadImage() {
    this.uploadService.uploadImage(this.imageData).then(
      (res) => {
        this.user.photo = res;
        this.updateUser();
        this.loading = false;
        this.dispImags = [];
        this.imageData = "";
      },
      (err) => {
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.ERROR_UPLOAD
            : MESSAGES.ERROR_UPLOAD_EN
        );
        //this.dismiss();
      }
    );
  }

  uploadImage() {
    this.presentLoading();
    var ref = this;
    this.loading = true;
    if (ref.imageData) {
      this.upLoadImage();
    } else {
      this.loading = false;
      this.updateUser();
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
    this.loading = true;
    return await this.loadingCtrl
      .create({
        duration: 5000,
      })
      .then((a) => {
        a.present().then(() => {
          // console.log('presented');
          if (!this.loading) {
            a.dismiss().then(() => console.log("abort presenting"));
          }
        });
      });
  }

  async dismissLoading() {
    this.loading = false;
    return await this.loadingCtrl
      .dismiss()
      .then(() => console.log("dismissed"));
  }

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null;
  }
}
