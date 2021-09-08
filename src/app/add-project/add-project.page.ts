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
import { MESSAGES } from "../constant/constant";
import { UploadService } from "../providers/upload.service";
import { TranslateService } from "@ngx-translate/core";

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
    let language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(language);
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
      header: "Ajouter une image",
      buttons: [
        {
          text: "Choisir dans votre galerie",
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },

        {
          text: "Utiliser la Camera",
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
          },
        },
        {
          text: "Annuler",
          role: "cancel",
        },
      ],
    });
    await actionSheet.present();
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 40,
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
        // alert(err)
      }
    );
  }

  upLoadImage() {
    this.uploadService.uploadImage(this.imageData).then(
      (res) => {
        this.project.photo.push(res);
        this.addProject();
        this.loading = false;
        this.dispImags = [];
        this.imageData = "";
      },
      (err) => {
        this.presentToast("Oops une erreur lors de l'upload");
        //this.dismiss();
      }
    );
  }

  uploadImage() {
    this.loading = true;
    if (this.imageData.length > 0) {
      this.upLoadImage();
    }
  }

  uploadImagePermission() {
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      .then(
        (result) => {
          if (result.hasPermission) {
            // code
            this.uploadImage();
          } else {
            this.androidPermissions
              .requestPermission(
                this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
              )
              .then((result) => {
                if (result.hasPermission) {
                  // code
                  this.uploadImage();
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

  uploadImages() {
    var interval = 0;
    var ref = this;

    function InnerFunc() {
      if (ref.photos.length) {
        const fileTransfer = ref.transfer.create();
        let options: FileUploadOptions = {
          fileKey: "photo",
          fileName: Math.random() * 100000000000000000 + ".jpg",
          chunkedMode: false,
          mimeType: "image/jpeg",
          headers: {},
        };

        var serverUrl = base_url + "upload-avatar";
        fileTransfer.upload(ref.photos[interval], serverUrl, options).then(
          (data) => {
            interval++;
            if (interval < ref.photos.length) {
              this.loading = false;
              this.project.photo.push(base_url + options.fileName);
              InnerFunc();
            } else {
              this.loading = false;
              ref.addProject();
            }
          },
          (err) => {
            alert(JSON.stringify(err));
          }
        );
      } else {
        ref.addProject();
      }
    }
    InnerFunc();
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
        this.presentToast("Publié sur le fil d'actualité");
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
            this.presentToast(MESSAGES.PROJECT_CREATED_OK);
            let userId = localStorage.getItem("teepzyUserId");
            this.getProjects(userId);
            this.addPost(post);
            this.dismiss();
          },
          (error) => {
            //console.log(error)
            this.loading = false;
            this.presentToast(MESSAGES.PROJECT_CREATED_ERROR);
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
            this.presentToast(MESSAGES.PROJECT_CREATED_OK);
            let userId = localStorage.getItem("teepzyUserId");
            this.getProjects(userId);
            this.dismiss();
          },
          (error) => {
            //console.log(error)
            this.loading = false;
            this.presentToast(MESSAGES.PROJECT_CREATED_ERROR);
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
