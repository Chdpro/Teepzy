import { Component, OnInit } from "@angular/core";
import { ContactService } from "../providers/contact.service";
import { ToastController, NavController } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { MESSAGES } from "../constant/constant";
import { fromEvent, Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-friends",
  templateUrl: "./friends.page.html",
  styleUrls: ["./friends.page.scss"],
})
export class FriendsPage implements OnInit {
  userId = "";
  members = [];
  loading = false;
  previousUrl = "";
  search: any;
  subscription: Subscription;
  language = "";

  constructor(
    private contactService: ContactService,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private translate: TranslateService
  ) {
    const event = fromEvent(document, "backbutton");
    event.subscribe(async () => {
      this.navCtrl.pop(); // I have used for my case
    });

    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(this.language);
  }

  ngOnInit() {
    this.userId = localStorage.getItem("teepzyUserId");
    this.previousUrl = this.route.snapshot.paramMap.get("previousUrl");
    let uId = this.route.snapshot.paramMap.get("idUser");
    if (!uId) {
      this.getUsersOfCircle();
    } else {
      this.userId = uId;
      this.getUsersOfCircle();
    }
  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  removeFromCircle(idMember) {
    let member = {
      idCreator: this.userId,
      idMember: idMember,
    };
    this.subscription = this.contactService
      .removeMemberFromCircle(member)
      .subscribe(
        (res) => {
          // console.log(res)
          this.presentToast(
            this.language === "fr"
              ? MESSAGES.CIRCLE_MEMBER_DELETED_OK
              : MESSAGES.CIRCLE_MEMBER_DELETED_OK_EN
          );
          this.getUsersOfCircle();
        },
        (error) => {
          // console.log(error)
        }
      );
  }

  getUsersOfCircle() {
    this.loading = true;
    this.subscription = this.contactService
      .getCircleMembers(this.userId)
      .subscribe(
        (res) => {
          //  console.log(res);
          this.members = res["data"];
          this.loading = false;
        },
        (error) => {
          //  console.log(error)
          this.loading = false;
        }
      );
  }

  gotoProfile(idUser) {
    this.router.navigate([
      "/tabs/profile",
      { userId: idUser, previousUrl: "friends" },
    ]);
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
