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
import { MESSAGES, type } from "../constant/constant";
import { UploadService } from "../providers/upload.service";
import { TranslateService } from "@ngx-translate/core";
import { ImageCropPage } from "../image-crop/image-crop.page";

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
    price: "0",
    userPhoto_url: "",
    userPseudo: "",
    commercialAction: "VENTE",
  };

  selected = "Euro";
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
  imageData = "";
  showModal = "hidden";
  user: any;

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
    private uploadService: UploadService,
    private androidPermissions: AndroidPermissions,
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
    this.product.userId = userId;
    this.getUserInfo(userId);
  }

  checkValue(value) {
    this.product.commercialAction = value.detail.value;
    if (this.product.commercialAction === "DON") this.product.price = "0";
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
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.POST_ON_FEED
            : MESSAGES.POST_ON_FEED_EN
        );

        this.dismiss();
      },
      (error) => {
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.ADD_FEED_ERROR
            : MESSAGES.ADD_FEED_ERROR_EN
        );
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
        price: this.product.price + this.selected,
        productId: "",
      };
      this.loading = true;
      this.tags.length > 0 ? (this.product.tags = this.tags) : null;
      this.product.userPhoto_url = this.user.photo;
      this.product.userPseudo = this.user.pseudoIntime;
      this.product.price = this.product.price + this.selected;
      this.subscription = this.contactService
        .addProduct(this.product)
        .subscribe(
          (res) => {
            // console.log(res);
            this.loading = false;
            this.presentToast(
              this.language === "fr"
                ? MESSAGES.SHOP_CREATED_OK
                : MESSAGES.SHOP_CREATED_OK_EN
            );

            let userId = localStorage.getItem("teepzyUserId");
            this.getProducts(userId);
            post.productId = res["data"]["_id"];
            this.addPost(post);
          },
          (error) => {
            // console.log(error)
            this.loading = false;
            this.presentToast(
              this.language === "fr"
                ? MESSAGES.SHOP_CREATED_ERROR
                : MESSAGES.SHOP_CREATED_ERROR_EN
            );
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
            this.presentToast(
              this.language === "fr"
                ? MESSAGES.SHOP_CREATED_OK
                : MESSAGES.SHOP_CREATED_OK_EN
            );

            let userId = localStorage.getItem("teepzyUserId");
            this.getProducts(userId);
            this.dismiss();
          },
          (error) => {
            // console.log(error)
            this.loading = false;
            this.presentToast(
              this.language === "fr"
                ? MESSAGES.SHOP_CREATED_ERROR
                : MESSAGES.SHOP_CREATED_ERROR_EN
            );
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
            this.pickImagePermission(
              this.camera.PictureSourceType.PHOTOLIBRARY
            );
          },
        },
        {
          text:
            this.language === "fr"
              ? MESSAGES.CAMERA_CHOICE
              : MESSAGES.CAMERA_CHOICE_EN,
          handler: () => {
            this.takeImagePermission(this.camera.PictureSourceType.CAMERA);
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
        // alert(JSON.stringify(err))
      }
    );
  }

  async presentCroppageModal(imageSelected) {
    const modal = await this.modalController.create({
      component: ImageCropPage,
      cssClass: "my-custom-class",
      componentProps: { imageSelected: imageSelected, page: type.PRODUCT },
    });
    return await modal.present();
  }

  upLoadImage() {
    if (this.dispImags[0]) {
      this.uploadService.uploadImage(this.imageData).then(
        (res) => {
          this.product.photo.push(res);
          this.addProduct();
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
      this.addProduct();
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
    //this.socket.removeAllListeners('message');
    //this.socket.removeAllListeners('users-changed');
  }
}
