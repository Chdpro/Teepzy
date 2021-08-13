import { Component, OnInit } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material";
import { AuthService } from "../providers/auth.service";
import { DatapasseService } from "../providers/datapasse.service";
import { Subscription } from "rxjs";
import {
  ModalController,
  ToastController,
  ActionSheetController,
  MenuController,
} from "@ionic/angular";
import { ContactService } from "../providers/contact.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { base_url } from "src/config";
import {
  FileTransfer,
  FileUploadOptions,
} from "@ionic-native/file-transfer/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { MESSAGES } from "../constant/constant";
import { UploadService } from "../providers/upload.service";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.page.html",
  styleUrls: ["./add-product.page.scss"],
})
export class AddProductPage implements OnInit {
  postOnFeed = true;
  title = "E-shop";
  product = {
    userId: "",
    nom: "",
    photo: [],
    tags: [],
    description: "",
    price: 0,
    userPhoto_url: "",
    userPseudo: "",
    commercialAction: "DON",
  };

  subscription: Subscription;

  listProducts = [];
  loading = false;

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
  showModal = "hidden";
  user: any;
  constructor(
    private modalController: ModalController,
    private toasterController: ToastController,
    private authService: AuthService,
    private dataPass: DatapasseService,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
    private menuCtrl: MenuController,
    private uploadService: UploadService,
    private androidPermissions: AndroidPermissions,
    private contactService: ContactService
  ) {
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);
  }

  ngOnInit() {
    let userId = localStorage.getItem("teepzyUserId");
    this.product.userId = userId;
    this.getUserInfo(userId);
  }

  checkValue(value) {
    this.product.commercialAction = value.detail.value;
    if (this.product.commercialAction === "DON") this.product.price = 0;
  }

  getUserInfo(userId) {
    this.subscription = this.authService.myInfos(userId).subscribe(
      (res) => {
        // console.log(res)
        this.user = res["data"];
      },
      (error) => {
        // console.log(error)
      }
    );
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
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

  getProducts(userId) {
    this.subscription = this.authService.myInfos(userId).subscribe(
      (res) => {
        // console.log(res)
        this.listProducts = res["products"];
        this.dataPass.sendProducts(this.listProducts);
      },
      (error) => {
        //console.log(error)
      }
    );
  }

  maxLengthDescription(ev: Event) {
    let desc = this.product.description;
    this.product.description.length > 100
      ? (this.product.description = desc.slice(0, 99))
      : null;
    // console.log(this.product.description.slice(0, 99))
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

  addProduct() {
    if (this.postOnFeed === true) {
      let post = {
        userId: this.product.userId,
        content: this.product.description,
        image_url: this.product.photo[0],
        video_url: "",
        userPhoto_url: this.user.photo,
        backgroundColor: "#fff",
        userPseudo: this.user.pseudoIntime,
        commercialAction: this.product.commercialAction,
        price: this.product.price,
      };
      this.loading = true;
      this.tags.length > 0 ? (this.product.tags = this.tags) : null;
      this.product.userPhoto_url = this.user.photo;
      this.product.userPseudo = this.user.pseudoIntime;
      this.subscription = this.contactService
        .addProduct(this.product)
        .subscribe(
          (res) => {
            // console.log(res);
            this.loading = false;
            this.presentToast(MESSAGES.SHOP_CREATED_OK);
            let userId = localStorage.getItem("teepzyUserId");
            this.getProducts(userId);
            this.addPost(post);
            this.dismiss();
          },
          (error) => {
            // console.log(error)
            this.loading = false;
            this.presentToast(MESSAGES.SHOP_CREATED_ERROR);
          }
        );
    } else {
      this.loading = true;
      this.tags.length > 0 ? (this.product.tags = this.tags) : null;
      this.product.userPhoto_url = this.user.photo;
      this.product.userPseudo = this.user.pseudoIntime;
      this.subscription = this.contactService
        .addProduct(this.product)
        .subscribe(
          (res) => {
            // console.log(res);
            this.loading = false;
            this.presentToast(MESSAGES.SHOP_CREATED_OK);
            let userId = localStorage.getItem("teepzyUserId");
            this.getProducts(userId);
            this.dismiss();
          },
          (error) => {
            // console.log(error)
            this.loading = false;
            this.presentToast(MESSAGES.SHOP_CREATED_ERROR);
          }
        );
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
            this.pickImagePermission(
              this.camera.PictureSourceType.PHOTOLIBRARY
            );
          },
        },
        {
          text: "Utiliser la Camera",
          handler: () => {
            this.takeImagePermission(this.camera.PictureSourceType.CAMERA);
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
        // alert(JSON.stringify(err))
      }
    );
  }

  upLoadImage() {
    this.uploadService.uploadImage(this.imageData).then(
      (res) => {
        this.product.photo.push(res);
        this.addProduct();
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

  uploadImages() {
    var interval = 0;
    var ref = this;

    function InnerFunc() {
      if (ref.photos.length > 0) {
        const fileTransfer = ref.transfer.create();
        let options: FileUploadOptions = {
          fileKey: "photo",
          fileName: Math.random() * 100000000000000000 + ".jpg",
          chunkedMode: false,
          mimeType: "image/jpeg",
          headers: {},
        };

        var serverUrl = base_url + "upload-avatar";
        fileTransfer
          .upload(ref.photos[interval], serverUrl, options)
          .then((data) => {
            interval++;
            if (interval < ref.photos.length) {
              this.loading = false;
              this.product.photo.push(base_url + options.fileName);
              InnerFunc();
            } else {
              this.loading = false;
              ref.addProduct();
            }
          });
      } else {
        ref.addProduct();
      }
    }
    InnerFunc();
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

  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null;
    //this.socket.removeAllListeners('message');
    //this.socket.removeAllListeners('users-changed');
  }
}
