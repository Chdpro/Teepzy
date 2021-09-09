import { Component, OnInit } from "@angular/core";
import { ContactService } from "../providers/contact.service";
import { ToastController, MenuController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { MESSAGES } from "../constant/constant";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-outcircle",
  templateUrl: "./outcircle.page.html",
  styleUrls: ["./outcircle.page.scss"],
})
export class OutcirclePage implements OnInit {
  loading = false;
  listTeepZrs = [];
  contactsTest = [
    {
      givenName: "Chris",
      familyName: "Hounsounou",
      phone: "+22998090908",
      invited: false,
    },
    {
      givenName: "Elvire",
      familyName: "Anato",
      phone: "+229 98098867",
      invited: false,
    },
    {
      givenName: "Deborah",
      familyName: "Houeha",
      phone: "+229 90980000",
      invited: true,
    },
    {
      givenName: "Claudia",
      familyName: "Houeha",
      phone: "+229 66889545",
      invited: false,
    },
  ];
  listTeepzrsToInvite = [];
  userId = "";

  subscription: Subscription;

  pageIndex: number = 0;
  pageSize: number = 5;
  lowValue: number = 0;
  highValue: number = 5;
  pageEvent: any;

  term = "";
  language = "";
  constructor(
    private contactService: ContactService,
    public toastController: ToastController,
    public router: Router,
    private menuCtrl: MenuController,
    private translate: TranslateService
  ) {
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);
    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(this.language);
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.userId = localStorage.getItem("teepzyUserId");
    this.getTeepzr();
  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  getPaginatorData(event) {
    //console.log(event);
    if (event.pageIndex === this.pageIndex + 1) {
      this.lowValue = this.lowValue + this.pageSize;
      this.highValue = this.highValue + this.pageSize;
    } else if (event.pageIndex === this.pageIndex - 1) {
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue = this.highValue - this.pageSize;
    }
    this.pageIndex = event.pageIndex;
  }

  goToFeed() {
    this.router.navigateByUrl("/tabs/tab1", {
      replaceUrl: true,
    });
  }

  getTeepzr() {
    this.loading = true;
    this.subscription = this.contactService
      .eventualKnownTeepZrs(this.userId)
      .subscribe(
        (res) => {
          //console.log(res)
          this.listTeepZrs = this.listSorter(res["data"]);
          this.loading = false;
          this.listTeepZrs.forEach((e) => {
            let invitation = {
              idSender: this.userId,
              idReceiver: e["_id"],
            };
            this.checkInvitation(invitation, e);
          });
          // console.log(this.listTeepZrs)
        },
        (error) => {
          // console.log(error)
          this.loading = false;
          this.presentToast(
            this.language === "fr"
              ? MESSAGES.SERVER_ERROR
              : MESSAGES.SERVER_ERROR_EN
          );
        }
      );
  }

  checkInvitation(invitation, e) {
    this.subscription = this.contactService
      .checkInvitationTeepzr(invitation)
      .subscribe((res) => {
        // console.log(res)
        if (res["status"] == 201) {
          this.listTeepzrsToInvite.push({
            _id: e["_id"],
            nom: e["nom"],
            prenom: e["prenom"],
            phone: e["phone"],
            photo: e["photo"],
            invited: true,
          });
        } else {
          this.listTeepzrsToInvite.push({
            _id: e["_id"],
            nom: e["nom"],
            prenom: e["prenom"],
            phone: e["phone"],
            photo: e["photo"],
            invited: false,
          });
        }
      });
  }

  sendInvitationToJoinCircle(idReceiver) {
    //console.log(idReceiver)
    this.loading = true;
    let invitation = {
      idSender: this.userId,
      idReceiver: idReceiver,
    };
    this.subscription = this.contactService
      .inviteToJoinCircle(invitation)
      .subscribe(
        (res) => {
          //console.log(res)
          this.listTeepzrsToInvite.find((c, index) =>
            c["_id"] == idReceiver ? (c["invited"] = true) : null
          );
          this.presentToast(
            this.language === "fr"
              ? MESSAGES.INVITATION_SEND_OK
              : MESSAGES.INVITATION_SEND_OK_EN
          );
          //console.log(this.listTeepzrsToInvite)
          //  this.getTeepzr()
          this.loading = false;
        },
        (error) => {
          this.presentToast(
            this.language === "fr"
              ? MESSAGES.INVITATION_SEND_ERROR
              : MESSAGES.INVITATION_SEND_ERROR_EN
          );
          this.loading = false;
          // alert(JSON.stringify(error))
        }
      );
  }

  listSorter(array: any) {
    array.sort((a, b) =>
      a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" })
    );
    return array;
  }

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null;
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }
}
