import { Component, OnInit } from "@angular/core";
import {
  ModalController,
  ToastController,
  NavParams,
  MenuController,
} from "@ionic/angular";
import { ContactService } from "../providers/contact.service";
import { AuthService } from "../providers/auth.service";
import { Globals } from "../globals";
import { MESSAGES } from "../constant/constant";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-link-sheet",
  templateUrl: "./link-sheet.page.html",
  styleUrls: ["./link-sheet.page.scss"],
})
export class LinkSheetPage implements OnInit {
  placeholder = "Bonjour! Je te link avec";
  placeholder_Link_userPseudo = "";
  userId = "";
  user: any;
  users = [];
  usersMatch = [];
  usersSelected = [];
  publication = {
    userId: "",
    _id: "",
  };
  match = true;
  loading = false;

  message = "";
  subscription: Subscription;
  private swipeCoord?: [number, number];
  private swipeTime?: number;

  selectedTab = 0;
  listTeepZrs = [];
  matches = [];
  checkItems = {};
  filtre: any;
  typeMatch = "";

  constructor(
    private modalController: ModalController,
    private contactService: ContactService,
    private toasterController: ToastController,
    private authService: AuthService,
    public globals: Globals,
    private menuCtrl: MenuController,
    private translate: TranslateService,
    private navParams: NavParams
  ) {
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);

    let language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(language);
  }

  ngOnInit() {}

  ionViewWillEnter() {
    let post = this.navParams.data["post"];
    this.typeMatch = this.navParams.data["typeMatch"];
    this.publication.userId = post.userId;
    this.publication._id = post._id;
    this.matches = post.matches;
    this.userId = localStorage.getItem("teepzyUserId");
    this.placeholder_Link_userPseudo = post.userPseudo;
    this.getUserInfo(this.userId);
    this.getUsersToMatch();
    this.getTeepzr();
  }

  getTeepzr() {
    this.subscription = this.contactService
      .getCircleMembers(this.userId)
      .subscribe(
        (res) => {
          // console.log(res)
          this.listTeepZrs = res["data"];
        },
        (error) => {
          // console.log(error)
        }
      );
  }

  closeModalOnSwipeDown(event) {
    // console.log('close modal');
    this.dismiss();
  }

  addLink(link) {
    //console.log(this.usersSelected.includes(link['_id']))
    if (this.usersSelected.includes(link["_id"])) {
      let l = this.deleteItemFromList(this.usersSelected, link["_id"]);
      this.usersSelected = l;
      //console.log(this.usersSelected)
    } else {
      this.usersSelected.push(link["_id"]);
      //console.log(this.usersSelected)
    }
  }

  deleteItemFromList(list, i) {
    // get index of object with id:37
    let removeIndex = list
      .map(function (item) {
        return item;
      })
      .indexOf(i);
    // remove object
    list.splice(removeIndex, 1);
    return list;
  }

  inviter() {
    this.user;
  }

  linkPeople() {
    let count = 0;
    if (this.usersSelected.length > 0) {
      for (const us of this.usersSelected) {
        count++;
        this.linker(us);
        count == this.usersSelected.length
          ? this.presentToast("Vous avez linké ces personnes")
          : null;
      }
    }
  }

  linker(linkedUserId) {
    let invitation = {
      idSender: this.publication.userId,
      idReceiver: linkedUserId,
      linkerId: this.userId,
      message: this.message,
      postId: this.publication._id,
    };
    if (this.userId == this.publication.userId) {
      this.presentToast(MESSAGES.AUTHO_FEED_NO_MATCH_OK);
    } else {
      this.subscription = this.contactService.linkPeoples(invitation).subscribe(
        (res) => {
          //console.log(res)
          //this.presentToast('Vous avez linké ce post')
          this.dismiss();
        },
        (error) => {
          this.presentToast("Oops! une erreur est survenue");
          //console.log(error)
        }
      );
    }
  }
  checkAvailability(arr, val) {
    return arr.some(function (arrVal) {
      return val === arrVal["_id"];
    });
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
          //console.log("Swipe left - INDEX: " + this.selectedTab);
        } else if (swipe === "previous") {
          const isLast = this.selectedTab === 2;
          if (this.selectedTab >= 1) {
            this.selectedTab = this.selectedTab - 1;
          }
          //console.log("Swipe right — INDEX: " + this.selectedTab);
        }
        // Do whatever you want with swipe
      }
    }
  }

  validateLinks() {
    this.loading = true;
    for (const uS of this.usersSelected) {
      uS[""];
      this.linker(uS);
    }
    this.loading = false;
  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  getUsersToMatch() {
    this.subscription = this.contactService
      .getUsersMatch(this.userId)
      .subscribe(
        (res) => {
          //console.log(res)
          this.users = res["data"];
          for (const u of this.users) {
            this.usersMatch.push({
              nom: u.nom,
              prenom: u.prenom,
              pseudoIntime: u.pseudoIntime,
              _id: u._id,
              match: false,
              photo: u.photo,
            });
          }
        },
        (error) => {
          // console.log(error)
        }
      );
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

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null;
  }
}
