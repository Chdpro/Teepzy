import { Component, OnInit } from "@angular/core";
import { AuthService } from "../providers/auth.service";
import { ContactService } from "../providers/contact.service";
import {
  ToastController,
  ActionSheetController,
  MenuController,
  AlertController,
  ModalController,
} from "@ionic/angular";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { DatapasseService } from "../providers/datapasse.service";
import { MESSAGES } from "../constant/constant";
import { RobotAlertPage } from "../robot-alert/robot-alert.page";
import { UploadService } from "../providers/upload.service";
import { ImageCropPage } from "../image-crop/image-crop.page";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.page.html",
  styleUrls: ["./edit-profile.page.scss"],
})
export class EditProfilePage implements OnInit {
  profile1 = {
    pseudoIntime: "",
    localisation: "",
    metier: "metier",
    userId: "",
    siteweb: "siteweb",
    socialsAmical: [],
    hobbies: [],
    bio: "",
    photo: "",
    tagsLabel: "Décrivez ce que vous aimez",
    bioLabel: "Présentez-vous",
    isAllProfileCompleted: false,
  };

  socials = [];
  socialsAdded = [];
  socialsAdde2 = [];

  user: any;
  rs_url = "";
  rs_url2 = "";

  media: any;
  media2: any;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags = [];

  visible1 = true;
  selectable1 = true;
  removable1 = true;
  removable2 = true;
  removable3 = true;

  addOnBlur1 = true;
  readonly separatorKeysCodes1: number[] = [ENTER, COMMA];
  tags1 = [];

  tab1 = 0;
  tab2 = 0;

  loading = false;

  photos: any = [];
  filesName = new Array();
  dispImags = [];
  imageData;
  showModal = "hidden";

  myImage = "";
  private swipeCoord?: [number, number];
  private swipeTime?: number;

  selectedTab = 0;
  subcription: Subscription;

  isEditableB = false;
  isEditableH = false;
  previousRoute = "";

  constructor(
    private authService: AuthService,
    private contactService: ContactService,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private menuCtrl: MenuController,
    private router: Router,
    private dataPasse: DatapasseService,
    public route: ActivatedRoute,
    private alertController: AlertController,
    private modalController: ModalController,
    private uploadService: UploadService,
    private toasterController: ToastController,
    private dataPass: DatapasseService
  ) {
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);
    this.previousRoute = this.route.snapshot.paramMap.get("previousUrl");
    this.subcription = this.dataPass.getUserPhoto().subscribe((photo) => {
      if (photo) {
        this.dispImags[0] = photo;
      }
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.getSocials();
    let userId = localStorage.getItem("teepzyUserId");
    this.profile1.userId = userId;
    this.getUserInfo(userId);
  }

  async presentRobotModal() {
    const modal = await this.modalController.create({
      component: RobotAlertPage,
      cssClass: "my-custom-class",
    });
    return await modal.present();
  }
  swipe2(e: TouchEvent, when: string): void {
    const coord: [number, number] = [
      e.changedTouches[0].clientX,
      e.changedTouches[0].clientY,
    ];
    const time = new Date().getTime();
    if (when === "start") {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === "end") {
      const direction = [
        coord[0] - this.swipeCoord[0],
        coord[1] - this.swipeCoord[1],
      ];
      const duration = time - this.swipeTime;
      if (
        duration < 1000 && //
        Math.abs(direction[0]) > 30 && // Long enough
        Math.abs(direction[0]) > Math.abs(direction[1] * 3)
      ) {
        // Horizontal enough
        const swipe = direction[0] < 0 ? "next" : "previous";
        console.info(swipe);
        if (swipe === "next") {
          const isFirst = this.selectedTab === 0;
          if (this.selectedTab <= 2) {
            this.selectedTab = isFirst ? 1 : this.selectedTab + 1;
          }
          // console.log("Swipe left - INDEX: " + this.selectedTab);
        } else if (swipe === "previous") {
          const isLast = this.selectedTab === 2;
          if (this.selectedTab >= 1) {
            this.selectedTab = this.selectedTab - 1;
          }
          // console.log("Swipe right — INDEX: " + this.selectedTab);
        }
        // Do whatever you want with swipe
      }
    }
  }

  updateProfile() {
    this.loading = true;
    let userId = localStorage.getItem("teepzyUserId");
    // update profile 1
    this.socialsAdde2.length > 0
      ? this.profile1.socialsAmical.concat(this.socialsAdde2)
      : null;
    this.tags.length > 0 ? (this.profile1.hobbies = this.tags) : null;
    this.subcription = this.authService.updateProfile(this.profile1).subscribe(
      (res) => {
        this.presentToast(MESSAGES.PROFILE_UPDATED_OK);
        this.getUserInfo(userId);
        this.loading = false;
        this.router.navigateByUrl("/tabs/profile", {
          replaceUrl: true,
        });
      },
      (error) => {
        this.presentToast(MESSAGES.PROFILE_UPDATED_ERROR);
        this.loading = false;
      }
    );
  }

  goToFeed() {
    this.router.navigateByUrl("/tabs/tab1", {
      replaceUrl: true,
    });
  }

  checkAvailability(arr, val) {
    return arr.some(function (arrVal) {
      return val === arrVal["_id"];
    });
  }
  addSocial() {
    let sociale = {
      _id: this.media["_id"],
      icon: this.media["icon"],
      nom: this.media["nom"],
      url: this.rs_url,
      type: this.media["type"],
    };

    this.checkAvailability(this.socialsAdded, sociale["_id"])
      ? this.presentToast("Ce média a été déjà ajouté")
      : this.socialsAdded.push(sociale);
  }

  addSocialProfile2() {
    let sociale = {
      _id: this.media2["_id"],
      icon: this.media2["icon"],
      nom: this.media2["nom"],
      url: this.rs_url2,
      type: this.media2["type"],
    };
    this.checkAvailability(this.socialsAdde2, sociale["_id"])
      ? this.presentToast("Ce média a été déjà ajouté")
      : this.socialsAdde2.push(sociale);
  }

  getSocials() {
    this.contactService.getSocials().subscribe(
      (res) => {
        this.socials = res;
      },
      (error) => {
        // console.log(error)
      }
    );
  }

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(
      (res) => {
        //  console.log(res)
        this.user = res["data"];
        this.dataPasse.send(this.user);
        this.profile1.pseudoIntime = this.user["pseudoIntime"];
        this.profile1.bio = this.user["bio"];
        this.profile1.localisation = this.user["localisation"];
        this.profile1.metier = this.user["metier"];
        this.profile1.siteweb = this.user["siteweb"];
        this.user["socialsAmical"]
          ? (this.socialsAdde2 = this.user["socialsAmical"])
          : null;
        this.profile1.socialsAmical = this.user["socialsAmical"];
        this.profile1.tagsLabel = this.user["tagsLabel"];
        this.profile1.bioLabel = this.user["bioLabel"];
        this.user["hobbies"] ? (this.tags = this.user["hobbies"]) : null;
        this.profile1.hobbies = this.user["hobbies"];
        this.user["photo"] ? (this.dispImags[0] = this.user["photo"]) : null;
        this.user["photo"] ? (this.profile1.photo = this.user["photo"]) : null;
        this.profile1["isAllProfileCompleted"] =
          this.user["isAllProfileCompleted"];
        this.profile1["isAllProfileCompleted"] !== true
          ? this.presentRobotModal()
          : null;
      },
      (error) => {
        // console.log(error)
      }
    );
  }

  done() {
    this.profile1["isAllProfileCompleted"] = true;
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Etes vous sur de vouloir modifier le titre de la rubrique?",
      message: "",
      buttons: [
        {
          text: "Annuler",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            this.presentToast("Annulé");
          },
        },

        {
          text: "Confirmer",
          handler: () => {
            this.swithEditModeB();
          },
        },
      ],
    });
    await alert.present();
  }

  async presentAlertConfirmH() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Etes vous sur de vouloir modifier le titre de la rubrique?",
      message: "",
      buttons: [
        {
          text: "Annuler",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            this.presentToast("Annulé");
          },
        },

        {
          text: "Confirmer",
          handler: () => {
            this.swithEditModeH();
          },
        },
      ],
    });
    await alert.present();
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

  add1(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      this.tags1.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  remove1(tag): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  remove2(tag): void {
    const index = this.tags1.indexOf(tag);
    if (index >= 0) {
      this.tags1.splice(index, 1);
    }
  }

  remove3(tag): void {
    const index = this.socialsAdde2.indexOf(tag);
    if (index >= 0) {
      this.socialsAdde2.splice(index, 1);
    }
  }

  remove(tag): void {
    const index = this.socialsAdded.indexOf(tag);
    if (index >= 0) {
      this.socialsAdded.splice(index, 1);
    }
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [
        {
          text: "Choisir dans votre galerie",
          handler: () => {
            this.pickImageDataUrl(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text: "Utiliser la Camera",
          handler: () => {
            this.pickImageDataUrl(this.camera.PictureSourceType.CAMERA);
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
        //this.myImage = 'data:image/jpeg;base64,' + imageData;

        this.dispImags[0] = (<any>window).Ionic.WebView.convertFileSrc(
          imageData
        );
        if (imageData) {
          this.imageData = imageData;
        }
      },
      (err) => {}
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
        this.profile1.photo = res;
        this.updateProfile();
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
    var ref = this;
    this.loading = true;
    if (ref.imageData) {
      this.upLoadImage();
    } else {
      this.loading = false;
      this.updateProfile();
    }
  }

  shwModal() {
    if (this.showModal === "hidden") {
      this.showModal = "visible";
    } else {
      this.showModal = "hidden";
    }
  }

  swithEditModeB() {
    this.isEditableB ? (this.isEditableB = false) : (this.isEditableB = true);
  }
  swithEditModeH() {
    this.isEditableH ? (this.isEditableH = false) : (this.isEditableH = true);
  }

  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }

  ngOnDestroy() {
    this.subcription ? this.subcription.unsubscribe() : null;
  }
}
