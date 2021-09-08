import { Component, OnInit } from "@angular/core";
import { MenuController, ToastController, NavController } from "@ionic/angular";
import { ContactService } from "../providers/contact.service";
import { MESSAGES } from "../constant/constant";
import { fromEvent, Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-suggest",
  templateUrl: "./suggest.page.html",
  styleUrls: ["./suggest.page.scss"],
})
export class SuggestPage implements OnInit {
  suggest = {
    reason: "",
    userId: "",
    type: "SUGGESTION",
  };

  loading = false;
  subscription: Subscription;
  constructor(
    private menuCtrl: MenuController,
    private contactService: ContactService,
    private toasterController: ToastController,
    private navCtrl: NavController,
    private translate: TranslateService
  ) {
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);
    let language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(language);
    const event = fromEvent(document, "backbutton");
    event.subscribe(async () => {
      this.navCtrl.pop(); // I have used for my case
    });
  }

  ngOnInit() {
    this.suggest.userId = localStorage.getItem("teepzyUserId");
  }

  suggesT() {
    this.loading = true;
    console.log(this.suggest);
    this.subscription = this.contactService.suggest(this.suggest).subscribe(
      (res) => {
        console.log(res);
        this.loading = false;
        this.presentToast(MESSAGES.SUGGEST_OK);
      },
      (error) => {
        console.log(error);
        this.loading = false;
        this.presentToast(MESSAGES.SERVER_ERROR);
      }
    );
  }

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null;
  }

  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }
}
