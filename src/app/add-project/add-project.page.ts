import { Component, OnInit } from "@angular/core";
import {
  ModalController,
  ActionSheetController,
  MenuController,
} from "@ionic/angular";
import { ContactService } from "../providers/contact.service";
import { ToastController } from "@ionic/angular";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material";
import { AuthService } from "../providers/auth.service";
import { DatapasseService } from "../providers/datapasse.service";
import { Subscription, interval } from "rxjs";
import { FilePath } from "@ionic-native/file-path/ngx";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { base_url } from "src/config";
import {
  FileTransfer,
  FileUploadOptions,
} from "@ionic-native/file-transfer/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { MESSAGES, type } from "../constant/constant";
import { UploadService } from "../providers/upload.service";
import { TranslateService } from "@ngx-translate/core";
import { ImageCropPage } from "../image-crop/image-crop.page";

@Component({
  selector: "app-add-project",
  templateUrl: "./add-project.page.html",
  styleUrls: ["./add-project.page.scss"],
})
export class AddProjectPage implements OnInit {
  postOnFeed = true;
  title = "Projets";
  project = {
    userId: "",
    nom: "",
    photo: [],
    tags: [],
    description: "",
    userPhoto_url: "",
    userPseudo: "",
  };

  subscription: Subscription;
  listProjects = [];
  loading = false;

  user: any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags = [];

  photos: any = [];
  filesName = new Array();
  dispImags = [];
  imageData;
  language = "";
  constructor(
    private modalController: ModalController,
    private toasterController: ToastController,
    private authService: AuthService,
    private dataPass: DatapasseService,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
    private menuCtrl: MenuController,
    private androidPermissions: AndroidPermissions,
    private uploadService: UploadService,
    private contactService: ContactService,
    private translate: TranslateService
  ) {
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);
    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(this.language);
    this.subscription = this.dataPass.get().subscribe((imageData) => {
      if (imageData) {
        this.dispImags[0] = imageData;
      }
    });
  }

  ngOnInit() {
    let userId = localStorage.getItem("teepzyUserId");
    this.project.userId = userId;
    this.getUserInfo(userId);
  }

  ionViewWillEnter() {}

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(
      (res) => {
        //console.log(res)
        this.user = res["data"];
      },
      (error) => {
        // console.log(error)
      }
    );
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  maxLengthDescription(ev: Event) {
    let desc = this.project.description;
    this.project.description.length > 100
      ? (this.project.description = desc.slice(0, 99))
      : null;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  remove(tag): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  async presentCroppageModal(imageSelected) {
    const modal = await this.modalController.create({
      component: ImageCropPage,
      cssClass: "my-custom-class",
      componentProps: { imageSelected: imageSelected, page: type.PROJECT },
    });
    return await modal.present();
  }

  pickImagePermission(sourceType) {
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      .then(
        (result) => {
          if (result.hasPermission) {
            // code
            this.pickImage(sourceType);
          } else {
            this.androidPermissions
              .requestPermission(
                this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
              )
              .then((result) => {
                if (result.hasPermission) {
                  // code
                  this.pickImage(sourceType);
                }
              });
          }
        },
        (err) => {
          alert(err);
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
          );
        }
      );
  }

  takeImagePermission(sourceType) {
    this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      )
      .then(
        (result) => {
          if (result.hasPermission) {
            // code
            this.pickImage(sourceType);
          } else {
            this.androidPermissions
              .requestPermission(
                this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
              )
              .then((result) => {
                if (result.hasPermission) {
                  // code
                  this.pickImage(sourceType);
                }
              });
          }
        },
        (err) => {
          alert(err);
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
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
            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },

        {
          text:
            this.language === "fr"
              ? MESSAGES.CAMERA_CHOICE
              : MESSAGES.CAMERA_CHOICE_EN,
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
          },
        },
        {
          text: this.language === "fr" ? "Annuler" : "Cancel",
          role: "cancel",
        },
      ],
    });
    await actionSheet.present();
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 60,
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
        let base64Image = "data:image/jpeg;base64," + imageData;
        if (base64Image) {
          this.presentCroppageModal(base64Image);
        }
      },
      (err) => {
        // Handle error
        // alert(err)
      }
    );
  }

  upLoadImage() {
    if (this.dispImags[0]) {
      this.uploadService.uploadImage(this.dispImags[0]).then(
        (res) => {
          this.project.photo.push(res);
          this.addProject();
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
    } else {
      this.addProject();
    }
  }

  getProjects(userId) {
    this.authService.myInfos(userId).subscribe(
      (res) => {
        // console.log(res)
        this.listProjects = res["projects"];
        this.dataPass.sendProjects(this.listProjects);
      },
      (error) => {
        // console.log(error)
      }
    );
  }

  addPost(post) {
    this.subscription = this.contactService.addPost(post).subscribe(
      (res) => {
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.POST_ON_FEED
            : MESSAGES.POST_ON_FEED_EN
        );
      },
      (error) => {
        // this.presentToast(MESSAGES.ADD_FEED_ERROR)
      }
    );
  }

  addProject() {
    if (this.postOnFeed === true) {
      let post = {
        userId: this.project.userId,
        content: this.project.description,
        image_url: this.project.photo[0],
        video_url: "",
        userPhoto_url: this.user.photo,
        backgroundColor: "#fff",
        userPseudo: this.user.pseudoIntime,
      };
      this.loading = true;
      this.tags.length > 0 ? (this.project.tags = this.tags) : null;
      this.project.userPhoto_url = this.user.photo;
      this.project.userPseudo = this.user.pseudoIntime;
      //this.photos.length > 0? this.uploadImage() : null
      this.subscription = this.contactService
        .addProject(this.project)
        .subscribe(
          (res) => {
            // console.log(res);
            this.loading = false;
            this.presentToast(
              this.language === "fr"
                ? MESSAGES.PROJECT_CREATED_OK
                : MESSAGES.PROJECT_CREATED_OK_EN
            );

            let userId = localStorage.getItem("teepzyUserId");
            this.getProjects(userId);
            this.addPost(post);
            this.dismiss();
          },
          (error) => {
            //console.log(error)
            this.loading = false;
            this.presentToast(
              this.language === "fr"
                ? MESSAGES.PROJECT_CREATED_ERROR
                : MESSAGES.PROJECT_CREATED_ERROR_EN
            );
          }
        );
    } else {
      this.loading = true;
      this.tags.length > 0 ? (this.project.tags = this.tags) : null;
      //this.photos.length > 0? this.uploadImage() : null
      this.project.userPhoto_url = this.user.photo;
      this.project.userPseudo = this.user.pseudoIntime;
      this.subscription = this.contactService
        .addProject(this.project)
        .subscribe(
          (res) => {
            // console.log(res);
            this.loading = false;
            this.presentToast(
              this.language === "fr"
                ? MESSAGES.PROJECT_CREATED_OK
                : MESSAGES.PROJECT_CREATED_OK_EN
            );

            let userId = localStorage.getItem("teepzyUserId");
            this.getProjects(userId);
            this.dismiss();
          },
          (error) => {
            //console.log(error)
            this.loading = false;
            this.presentToast(
              this.language === "fr"
                ? MESSAGES.PROJECT_CREATED_ERROR
                : MESSAGES.PROJECT_CREATED_ERROR_EN
            );
          }
        );
    }
  }

  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null;
  }
}
