import { Component, Input, OnInit } from "@angular/core";
import { ModalController, NavParams, ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { CACHE_KEYS, MESSAGES } from "../constant/constant";
import { Globals } from "../globals";
import { ContactService } from "../providers/contact.service";
import { DatapasseService } from "../providers/datapasse.service";

@Component({
  selector: "app-likers",
  templateUrl: "./likers.page.html",
  styleUrls: ["./likers.page.scss"],
})
export class LikersPage implements OnInit {
  userId = "";

  post: any;
  loading = false;
  likers = [];

  likeLoading = false;
  language = "";

  constructor(
    private toasterController: ToastController,
    private contactService: ContactService,
    private dataPass: DatapasseService,
    private modalController: ModalController,
    public globals: Globals,
    private navParams: NavParams,
    private translate: TranslateService
  ) {
    this.post = this.navParams.data;

    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(this.language);
  }

  ngOnInit() {
    this.userId = localStorage.getItem("teepzyUserId");
    this.getLikers();
  }

  doRefresh(event) {
    //console.log('Begin async operation');
    setTimeout(() => {
      //console.log('Async operation has ended');
      this.getLikers();
      event.target.complete();
    }, 400);
  }

  getLikers() {
    this.loading = true;
    this.contactService.likers(this.post._id).subscribe(
      (res) => {
        this.likers = res["data"];
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  addFavorite() {
    //  console.log(postId)
    let favoris = {
      userId: this.userId,
      postId: this.post._id,
      type: "POST",
    };
    this.likeLoading = true;
    this.contactService.addFavorite(favoris).subscribe(
      (res) => {
        this.dataPass.sendLike({ postId: this.post._id, like: true });
        this.likeLoading = false;
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.FAVORITE_OK
            : MESSAGES.FAVORITE_OK_EN
        );
        this.dismiss();
      },
      (error) => {
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.SERVER_ERROR
            : MESSAGES.SERVER_ERROR_EN
        );
        this.likeLoading = false;

        // console.log(error)
      }
    );
  }

  removeFavorite() {
    this.likeLoading = true;
    let favoris = {
      userId: this.userId,
      postId: this.post._id,
    };
    this.contactService.removeFavorite(favoris).subscribe(
      (res) => {
        this.dataPass.sendLike({ postId: this.post._id, like: false });
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.REMOVE_FAVORITE_OK
            : MESSAGES.REMOVE_FAVORITE_OK_EN
        );
        this.likeLoading = false;
        this.dismiss();
      },
      (error) => {
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.SERVER_ERROR
            : MESSAGES.SERVER_ERROR_EN
        );
        this.likeLoading = false;

        //  console.log(error)
      }
    );
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
    if (this.globals.showBackground) {
      this.globals.showBackground = false;
    } else {
      this.globals.showBackground = true;
    }
  }

  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }
}
