import { Component, OnInit, ViewChild } from "@angular/core";
import {
  Base64ToGallery,
  Base64ToGalleryOptions,
} from "@ionic-native/base64-to-gallery/ngx";
import { ModalController, NavParams, ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { ImageCroppedEvent, ImageCropperComponent } from "ngx-image-cropper";
import { Subscription } from "rxjs";
import { MESSAGES } from "../constant/constant";
import { AuthService } from "../providers/auth.service";
import { DatapasseService } from "../providers/datapasse.service";
import { UploadService } from "../providers/upload.service";

@Component({
  selector: "app-image-crop",
  templateUrl: "./image-crop.page.html",
  styleUrls: ["./image-crop.page.scss"],
})
export class ImageCropPage implements OnInit {
  croppedImage = null;
  @ViewChild(ImageCropperComponent, { static: false })
  angularCropper: ImageCropperComponent;

  subscription: Subscription;
  dispImags = [];
  imageData = "";
  myImage = "";
  loading = false;

  profile1 = {
    photo: "",
    userId: "",
  };

  imageConverted = "";
  language = "";
  page = "";
  constructor(
    private navParams: NavParams,
    private base64ToGallery: Base64ToGallery,
    private modalController: ModalController,
    private uploadService: UploadService,
    private toasterController: ToastController,
    private authService: AuthService,
    private dataPass: DatapasseService,
    private translate: TranslateService
  ) {
    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(this.language);
  }

  ngOnInit() {
    this.myImage = this.navParams.data["imageSelected"];
    this.page = this.navParams.data["page"];

    console.log(this.navParams.data);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.base64ToImage(this.croppedImage);
  }

  imageLoaded() {}

  base64ToImage(base64Data) {
    let options: Base64ToGalleryOptions = {
      prefix: "_img",
      mediaScanner: true,
    };
    this.base64ToGallery.base64ToGallery(base64Data, options).then(
      (res) => {
        this.imageConverted = res;
      },
      (err) => console.log("Error saving image to gallery ", err)
    );
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  updateProfile() {
    this.loading = true;
    let userId = localStorage.getItem("teepzyUserId");
    this.profile1.userId = userId;
    // update profile 1
    this.authService.updateUserPhoto(this.profile1).subscribe(
      (res) => {
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.PROFILE_UPDATED_OK
            : MESSAGES.PROFILE_UPDATED_OK_EN
        );
        this.dataPass.sendUserPhoto(this.profile1.photo);
        this.loading = false;
        this.dismiss();
      },
      (error) => {
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.PROFILE_UPDATED_ERROR
            : MESSAGES.PROFILE_UPDATED_ERROR_EN
        );
        this.loading = false;
      }
    );
  }

  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }

  upLoadImage() {
    this.loading = true;
    this.uploadService.uploadImage(this.imageConverted).then(
      (res) => {
        this.profile1.photo = res;
        if (this.page === "PRODUCT" || this.page === "PROJECT") {
          this.dataPass.send(this.imageConverted);
          this.dismiss();
        } else {
          this.updateProfile();
        }
        this.loading = false;
      },
      (err) => {
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.ERROR_UPLOAD
            : MESSAGES.ERROR_UPLOAD_EN
        );
        //this.dismiss();
        this.loading = false;
      }
    );
  }

  clear() {
    // this.angularCropper.imageBase64 = null
    // this.myImage = null;
    // this.croppedImage = null
    this.dispImags = [];
    this.myImage = "";
  }

  save() {
    this.angularCropper.crop();
  }

  rotateLeft() {}
  rotateRight() {}
  flipVertical() {}
  move(x, y) {
    this.angularCropper.cropper.x1 += x;
    this.angularCropper.cropper.x2 += x;
    this.angularCropper.cropper.y1 += y;
    this.angularCropper.cropper.y2 += y;
  }
}
