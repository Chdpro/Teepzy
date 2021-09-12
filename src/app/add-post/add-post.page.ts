import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  ModalController,
  ToastController,
  AlertController,
  ActionSheetController,
  MenuController,
} from "@ionic/angular";
import { ContactService } from "../providers/contact.service";
import { AuthService } from "../providers/auth.service";
import { DatapasseService } from "../providers/datapasse.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import {
  FileTransfer,
  FileUploadOptions,
} from "@ionic-native/file-transfer/ngx";
import { base_url } from "src/config";
import { Subscription } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";
import { MESSAGES } from "../constant/constant";
import {
  MediaCapture,
  MediaFile,
  CaptureError,
  CaptureVideoOptions,
} from "@ionic-native/media-capture/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { Router } from "@angular/router";
import { File } from "@ionic-native/file/ngx";
import { ImageCroppedEvent, ImageCropperComponent } from "ngx-image-cropper";
import { UploadService } from "../providers/upload.service";
import { TranslateService } from "@ngx-translate/core";
import {
  Base64ToGallery,
  Base64ToGalleryOptions,
} from "@ionic-native/base64-to-gallery/ngx";

@Component({
  selector: "app-add-post",
  templateUrl: "./add-post.page.html",
  styleUrls: ["./add-post.page.scss"],
})
export class AddPostPage implements OnInit {
  post = {
    userId: "",
    content: "",
    image_url: "",
    video_url: "",
    userPhoto_url: "",
    backgroundColor: "#fff",
    userPseudo: "",
  };

  loading = false;
  showModal = false;
  user: any;
  listPosts = [];

  photos: any = [];
  filesName = new Array();
  dispImags = [];
  userPhoto = [];

  videos: any = [];
  videoFilesName = new Array();
  dispVideos = [];

  testVideos = ["../../assets/test.mp4"];

  subscription: Subscription;
  imageData;
  @ViewChild("myVideo", null) videoPlayers: ElementRef;

  currentPlaying = null;
  createdPost;

  myImage = "";
  croppedImage = null;
  @ViewChild(ImageCropperComponent, { static: false })
  angularCropper: ImageCropperComponent;

  imageBase64 = {
    imageName: "",
    base64image: "",
  };
  imageConverted = "";

  items: string[] = ["Noah", "Liam", "Mason", "Jacob"];

  userId = "";
  members = [];
  language = "";
  constructor(
    public modalController: ModalController,
    private toastController: ToastController,
    private authService: AuthService,
    private contactService: ContactService,
    private dataPass: DatapasseService,
    public alertController: AlertController,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
    public sanitizer: DomSanitizer,
    private menuCtrl: MenuController,
    private mediaCapture: MediaCapture,
    private uploadService: UploadService,
    private router: Router,
    private file: File,
    private webView: WebView,
    private base64ToGallery: Base64ToGallery,
    private translate: TranslateService
  ) {
    //this.menuCtrl.enable(false);
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);

    let language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(language);
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.userId = localStorage.getItem("teepzyUserId");
    this.post.userId = localStorage.getItem("teepzyUserId");
    this.getUserInfo(this.post.userId);
    this.getUsersOfCircle();
    //this.socket.emit('online', this.post.userId);
  }

  removeMedia() {
    this.dispVideos = [];
    this.dispImags = [];
  }

  getUsersOfCircle() {
    this.subscription = this.contactService
      .getCircleMembers(this.userId)
      .subscribe(
        (res) => {
          //console.log(res);
          this.members = res["data"];
        },
        (error) => {
          // console.log(error)
        }
      );
  }

  getUserInfo(userId) {
    this.subscription = this.authService.myInfos(userId).subscribe(
      (res) => {
        this.user = res["data"];
        this.user["photo"] ? (this.userPhoto[0] = this.user["photo"]) : null;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  dismissConfirmModal() {
    if (this.showModal) {
      this.showModal = false;
    } else {
      this.showModal = true;
    }
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header:
        this.language === "fr"
          ? MESSAGES.SELECT_MEDIA
          : MESSAGES.SELECT_MEDIA_EN,
      cssClass: "add-post-img",
      buttons: [
        {
          text:
            this.language === "fr"
              ? MESSAGES.GALLERY_CHOICE
              : MESSAGES.GALLERY_CHOICE_EN,
          icon: "images",
          handler: () => {
            this.picImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        /* {
        text: 'Utiliser la Camera',
        icon: "camera",
        handler: () => {
          this.takeImage(this.camera.PictureSourceType.CAMERA);
        }
      },*/
        /* {
        text: 'Choisir une vidéo',
        icon: "grid",
        handler: () => {
          this.chooseVideo();
        }
      },*/
        /*{
        text: 'Enregistrer une vidéo',
        icon: "videocam",
        handler: () => {
          this.takeVideo();
        }
      },*/
        {
          text: this.language === "fr" ? "Annuler" : "Cancel",
          icon: "close",
          role: "cancel",
        },
      ],
    });
    await actionSheet.present();
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

  upLoadImage() {
    this.loading = true;
    if (this.imageConverted) {
      this.uploadService.uploadImage(this.imageConverted).then(
        (res) => {
          this.post.image_url = res;
          this.addPost();
          this.loading = false;
          this.presentToast(
            this.language === "fr"
              ? MESSAGES.ADD_FEED_OK
              : MESSAGES.ADD_FEED_OK_EN
          );
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
    } else {
      this.addPost();
    }
  }

  clear() {
    // this.angularCropper.imageBase64 = null
    // this.myImage = null;
    // this.croppedImage = null
    this.dispImags = [];
    this.myImage = "";
    this.imageData = "";
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

  takeImage(sourceType) {
    const options: CameraOptions = {
      quality: 40,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        this.dispImags.push(this.webView.convertFileSrc(imageData));
        if (imageData) {
          this.imageData = imageData;
        }
      },
      (err) => {
        // Handle error
      }
    );
  }

  takeVideo() {
    let options: CaptureVideoOptions = { limit: 1, duration: 15 };
    this.mediaCapture.captureVideo(options).then(
      (data: MediaFile[]) => {
        let captureFile = data[0];
        let fileName = captureFile.name;
        let dir = captureFile["localURL"];
        dir.pop();
        let fromDirectory = dir.join("/");
        let toDirectory = this.file.dataDirectory;
        this.file
          .copyFile(fromDirectory, fileName, toDirectory, fileName)
          .then((res) => {});
      },
      (err: CaptureError) => {
        console.error(err);
        alert(JSON.stringify(err));
      }
    );
  }

  /* chooseVideo() {
    if (this.user.isPhotoAuthorized === true) {
        this.fileChooser
          .open({ mime: "video/mp4" })
          .then((uri) => {
            //alert(uri)
            //const pictures = "data:image/jpeg;base64," + uri;
            //this.presentModal(uri, pictures);
            this.dispVideos.push(this.webview.convertFileSrc(uri))
  
            this.videos.push(uri)
          })
          .catch((e) => console.log(e));
    }else {
      this.presentToast("Vous n'avez pas autorisé l'accès à la prise de photo")
    }
  }
*/

  confirmBeforePosting() {
    this.showModal = true;
    console.log(this.showModal);
  }

  addPost() {
    this.loading = true;
    this.post.userPhoto_url = this.user.photo;
    this.post.userPseudo = this.user.pseudoIntime;
    this.subscription = this.contactService.addPost(this.post).subscribe(
      (res) => {
        if (res["status"] == 200) {
          this.createdPost = res["data"];
          this.dataPass.sendPosts(this.createdPost);
          this.router.navigate(["/tabs/tab1"]);
          this.loading = false;
        }
      },
      (error) => {
        this.loading = false;
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.ADD_FEED_ERROR
            : MESSAGES.ADD_FEED_ERROR_EN
        );
      }
    );
  }

  // Data url file select
  picImage(sourceType) {
    if (this.user.isPhotoAuthorized === true) {
      const options: CameraOptions = {
        quality: 70,
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
          this.myImage = "data:image/jpeg;base64," + imageData;
          // this.dispImags.push(this.webView.convertFileSrc(imageData));
          if (imageData) {
            this.imageData = imageData;
          }
        },
        (err) => {
          // Handle error
        }
      );
    } else {
      this.presentToast(
        this.language === "fr"
          ? MESSAGES.UNABLE_TAKE_PHOTO
          : MESSAGES.UNABLE_TAKE_PHOTO_EN
      );
    }
  }

  setBackgroundColor(color: string) {
    console.log(color);
    this.post.backgroundColor = color;
    this.presentToast(
      this.language === "fr"
        ? MESSAGES.COLOR_CHOSED_OK
        : MESSAGES.COLOR_CHOSED_OK_EN
    );
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null;
  }
}
