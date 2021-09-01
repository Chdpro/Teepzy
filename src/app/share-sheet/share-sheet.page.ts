import { Component, OnInit } from "@angular/core";
import {
  ModalController,
  NavParams,
  ToastController,
  AlertController,
  MenuController,
} from "@ionic/angular";
import { Globals } from "../globals";
import { ContactService } from "../providers/contact.service";
import { DatapasseService } from "../providers/datapasse.service";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { MESSAGES } from "../constant/constant";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-share-sheet",
  templateUrl: "./share-sheet.page.html",
  styleUrls: ["./share-sheet.page.scss"],
})
export class ShareSheetPage implements OnInit {
  post: any;
  repost: any;
  userId = "";
  posts = [];
  timeCall = 0;
  listPosts = [];
  subscription: Subscription;
  sharers = [];
  loading = false;

  constructor(
    private modalController: ModalController,
    public globals: Globals,
    private navParams: NavParams,
    private contactService: ContactService,
    private toastController: ToastController,
    private dataPasse: DatapasseService,
    private alertController: AlertController,
    private socialSharing: SocialSharing,
    private menuCtrl: MenuController,
    private translate: TranslateService
  ) {
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);

    let language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(language);
  }

  ngOnInit() {
    this.userId = localStorage.getItem("teepzyUserId");
    this.post = this.navParams.data;
    this.getSharers();
  }

  closeModalOnSwipeDown(event) {
    //console.log('close modal');
    this.dismiss();
  }

  sendShare() {
    this.socialSharing
      .share(
        "Bonjour,  je t'invite à me rejoindre sur Teepzy et partager les bons plans et conseils. Télécharge Teepzy via",
        null,
        " https://play.google.com/store/apps/details?id=bsd.teepzy.com"
      )
      .then(() => {})
      .catch((err) => {
        // alert(JSON.stringify(err))
      });
  }

  getSharers() {
    this.loading = true;
    this.contactService.sharers(this.post._id).subscribe(
      (res) => {
        this.sharers = res["data"];
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  rePost() {
    this.repost = {
      postId: this.post["_id"],
      fromId: this.post["userId"],
      reposterId: this.userId,
      userPhoto_url: this.post["userPhoto_url"],
      userPseudo: this.post["userPseudo"],
      content: this.post["content"],
      image_url: this.post["image_url"] || "",
      video_url: this.post["video_url"] || "",
      backgroundColor: this.post["backgroundColor"],
      includedCircles: this.post["includedCircles"],
      commercialAction: this.post["commercialAction"],
      price: this.post["price"],
    };
    this.subscription = this.contactService.rePost(this.repost).subscribe(
      (res) => {
        this.getPosts(this.userId);
        this.presentToast(MESSAGES.SHARE_OK);
        this.dismiss();
      },
      (error) => {
        this.presentToast(MESSAGES.SHARE_ERROR);
      }
    );
  }

  doRefresh(event) {
    //  console.log('Begin async operation');
    setTimeout(() => {
      //  console.log('Async operation has ended');
      this.getSharers();
      event.target.complete();
    }, 400);
  }

  getPosts(userId) {
    this.timeCall = 1;
    this.subscription = this.contactService.getPosts(userId).subscribe(
      (res) => {
        this.listPosts = [];
        if (res["data"] != null) {
          this.posts = res["data"];
          this.posts.forEach((e) => {
            let favorite = {
              userId: this.userId,
              postId: e["_id"],
            };
            this.checkFavorite(favorite, e);
          });
        }

        this.timeCall = 0;
      },
      (error) => {
        // console.log(error)
      }
    );
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Pourquoi signlez-vous cette publication ?",
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
          text: "Diffuse une fausse information",
          handler: () => {
            let reason = "Diffuse une fausse information";
            this.signaler(this.post["_id"], reason);
          },
        },
        {
          text: "Propos Illégaux",
          handler: () => {
            let reason = "Propos Illégaux";
            this.signaler(this.post["_id"], reason);
          },
        },
        {
          text: "Proposition incitant à commettre un acte illégal",
          handler: () => {
            let reason = "Proposition incitant à commettre un acte illégal";
            this.signaler(this.post["_id"], reason);
          },
        },
      ],
    });
    await alert.present();
  }

  signaler(pId, reason) {
    let spam = {
      userId: this.userId,
      postId: pId,
      reason: reason,
    };
    this.subscription = this.contactService.spam(spam).subscribe(
      (res) => {
        //  console.log(res)
        this.presentToast(MESSAGES.CENSURED_OK);
      },
      (error) => {
        this.presentToast(MESSAGES.CENSURED_ERROR);
        //  console.log(error)
      }
    );
  }

  checkFavorite(favorite, e) {
    this.subscription = this.contactService
      .checkFavorite(favorite)
      .subscribe((res) => {
        if (res["status"] == 201) {
          this.listPosts.push({
            _id: e["_id"],
            userId: e["userId"],
            userPhoto_url: e["userPhoto_url"],
            userPseudo: e["userPseudo"],
            content: e["content"],
            image_url: e["image_url"],
            video_url: e["video_url"],
            backgroundColor: e["backgroundColor"],
            includedUsers: e["includedUsers"],
            createdAt: e["createdAt"],
            reposterId: e["reposterId"],
            matches: e["matches"],
            favorite: true,
          });
        } else {
          this.listPosts.push({
            _id: e["_id"],
            userId: e["userId"],
            userPhoto_url: e["userPhoto_url"],
            userPseudo: e["userPseudo"],
            content: e["content"],
            image_url: e["image_url"],
            video_url: e["video_url"],
            backgroundColor: e["backgroundColor"],
            includedUsers: e["includedUsers"],
            createdAt: e["createdAt"],
            reposterId: e["reposterId"],
            matches: e["matches"],
            favorite: false,
          });
        }
        this.dataPasse.sendPosts(this.listPosts);
      });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
    this.globals.showBackground = false;
  }

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null;
  }
}
