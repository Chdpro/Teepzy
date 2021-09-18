import { Component, OnInit } from "@angular/core";
import {
  ActionSheetController,
  LoadingController,
  ModalController,
  NavParams,
  ToastController,
} from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { MESSAGES } from "../constant/constant";
import { Globals } from "../globals";
import { ContactService } from "../providers/contact.service";
import { DatapasseService } from "../providers/datapasse.service";

@Component({
  selector: "app-views",
  templateUrl: "./views.page.html",
  styleUrls: ["./views.page.scss"],
})
export class ViewsPage implements OnInit {
  language = "";
  scopeCount = 0;
  views = [];
  userId = "";
  post: any;
  loading = false;

  constructor(
    public globals: Globals,
    private modalController: ModalController,
    private translate: TranslateService,
    private navParams: NavParams,
    private contactService: ContactService,
    private toasterController: ToastController,
    private actionSheetController: ActionSheetController,
    private dataPasse: DatapasseService,
    private loadingCtrl: LoadingController
  ) {
    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(this.language);
  }

  ngOnInit() {
    this.userId = localStorage.getItem("teepzyUserId");
    this.post = this.navParams.data;
    this.views = this.post.views;
    this.getScopeCount();
  }

  getScopeCount() {
    this.contactService
      .scopeCountOnPost(this.post._id, this.post.userId || this.post.reposterId)
      .subscribe(
        (res) => {
          this.scopeCount = res["data"];
        },
        (error) => {
          console.log(error);
        }
      );
  }

  async presentActionSheet(post) {
    const actionSheet = await this.actionSheetController.create({
      cssClass: "my-custom-class",
      buttons: [
        {
          text: this.language === "fr" ? "Supprimer?" : "Delete?",
          role: "destructive",
          icon: "trash",
          handler: () => {
            this.deletePost(post);
          },
        },
        {
          text: this.language === "fr" ? "Terminé" : "Finished",
          icon: "close",
          role: "cancel",
          handler: () => {
            this.presentToast(this.language === "fr" ? "Annulé" : "Cancel");
          },
        },
      ],
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log("onDidDismiss resolved with role", role);
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
  deletePost(post) {
    this.presentLoading();
    this.contactService.deletePost(post._id, this.userId).subscribe(
      (res) => {
        this.dataPasse.send(post._id);
        this.dismissLoading();
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.DELETE_FEED_OK
            : MESSAGES.DELETE_FEED_OK_EN
        );
        this.dismiss();
      },
      (error) => {
        this.dismissLoading();
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.DELETE_FEED_ERROR
            : MESSAGES.DELETE_FEED_ERROR_EN
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

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
    this.globals.showBackground = false;
  }
}
