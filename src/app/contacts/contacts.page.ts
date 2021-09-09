import { Component, Input, NgZone, OnInit } from "@angular/core";
import { Contacts } from "@ionic-native/contacts/ngx";
import { ContactService } from "../providers/contact.service";
import {
  ToastController,
  AlertController,
  MenuController,
  NavParams,
  ModalController,
} from "@ionic/angular";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../providers/auth.service";
import {
  typeAccount,
  CACHE_KEYS,
  MESSAGES,
  PERMISSION,
  messageShare,
} from "../constant/constant";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { Subscription } from "rxjs";
import { MatSnackBar } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-contacts",
  templateUrl: "./contacts.page.html",
  styleUrls: ["./contacts.page.scss"],
})
export class ContactsPage implements OnInit {
  minus = 0;
  term: any;
  contact: any;
  pageEvent: any;
  userInfo: any;
  n: Boolean = true;
  myContacts = [];
  listTeepzrsToInvite = [];
  listTeepzrsToInviteOutCircle = [];
  listContacts = [];
  listTeepZrs = [];
  circleMembersId = [];
  contactsTest = [
    {
      name: { givenName: "Chris", familyName: "Placktor" },
      phoneNumbers: [{ value: "+22998148917" }, { value: "+229 98 14 89 17" }],
    },
    {
      name: { givenName: "Hervé ", familyName: "KITEBA SIMO" },
      phoneNumbers: [{ value: "+33679560431" }, { value: "+33 67 95 60 431" }],
    },

    {
      name: { givenName: "Ridy", familyName: "FRANCE" },
      phoneNumbers: [{ value: "+33663534043" }],
    },

    {
      name: { givenName: "Debor", familyName: "oueha" },
      phoneNumbers: [{ value: "+22990980000" }, { value: "+229 90 98 00 00" }],
    },
    {
      name: { givenName: "Guy", familyName: "BSD" },
      phoneNumbers: [{ value: "+229 96883041" }],
    },
    {
      name: { givenName: "Deborah", familyName: "Houeha" },
      phoneNumbers: [{ value: "+22990980000" }, { value: "+229 90 98 00 00" }],
    },
    {
      name: { givenName: "Claudia", familyName: "Houeha" },
      phoneNumbers: [{ value: "+22966889545" }, { value: "+229 66 88 95 45" }],
    },
  ];
  isDragged = true;
  loading = false;
  userId = "";
  arrayIncrementLoading = false;

  pageIndex: number = 0;
  pageSize: number = 5;
  lowValue: number = 0;
  highValue: number = 5;

  pageIndexT: number = 0;
  pageSizeT: number = 5;
  lowValueT: number = 0;
  highValueT: number = 5;

  userPhone = "";
  previousUrl: string;

  private swipeCoord?: [number, number];
  private swipeTime?: number;
  selectedTab = 0;

  previousRoute = "";

  subscription: Subscription;
  invite: any;

  language = "";
  constructor(
    private contacts: Contacts,
    public toastController: ToastController,
    private socialSharing: SocialSharing,
    public router: Router,
    public route: ActivatedRoute,
    public alertController: AlertController,
    private authService: AuthService,
    private menuCtrl: MenuController,
    private diagnostic: Diagnostic,
    private androidPermissions: AndroidPermissions,
    private zone: NgZone,
    private contactService: ContactService,
    private _snackBar: MatSnackBar,
    private navParams: NavParams,
    private modalController: ModalController,
    private translate: TranslateService
  ) {
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);
    this.previousRoute = this.route.snapshot.paramMap.get("previousUrl");
    this.previousRoute
      ? null
      : (this.previousRoute = this.navParams.data.previousUrl);
    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(this.language);
  }

  ngOnInit() {
    this.userId = localStorage.getItem("teepzyUserId");
    this.userPhone = localStorage.getItem("teepzyPhone");
    this.CheckPermissions();
    this.getUsersOfCircle();
    if (this.previousRoute) {
      this.getCachedContacts();
      this.openSnackBar();
    } else {
      this.getUserInfo(this.userId);
    }
    this.getTeepzrOutCircle();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  CheckPermissions() {
    const androidPermissionsList = [
      {
        key: PERMISSION.WRITE_EXTERNAL_STORAGE,
        value: this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
      },
      {
        key: PERMISSION.READ_EXTERNAL_STORAGE,
        value: this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
      },
      {
        key: PERMISSION.READ_CONTACTS,
        value: this.androidPermissions.PERMISSION.READ_CONTACTS,
      },
      {
        key: PERMISSION.WRITE_CONTACTS,
        value: this.androidPermissions.PERMISSION.WRITE_CONTACTS,
      },
      {
        key: PERMISSION.CAMERA,
        value: this.androidPermissions.PERMISSION.CAMERA,
      },
    ];
    let checkContactRefuse = localStorage.getItem("ContactRefuseCounter");
    let checkStorageRefuse = localStorage.getItem("StorageRefuseCounter");
    let checkCamRefuse = localStorage.getItem("CamRefuseCounter");

    for (const apl of androidPermissionsList) {
      this.androidPermissions.checkPermission(apl.value).then(
        (success) => {
          if (success.hasPermission) {
            localStorage.setItem(apl.key, apl.key);
            // permission granted
          } else if (
            success.hasPermission === false &&
            (checkContactRefuse === "2" ||
              checkStorageRefuse === "2" ||
              checkCamRefuse === "2")
          ) {
          } else {
            this.router.navigate(["/permissions"]);
          }
        },
        (err) => {
          this.router.navigate(["/permissions"]);
        }
      );
    }
  }

  getCachedContacts() {
    this.subscription = this.contactService
      .getContactsCached(CACHE_KEYS.CONTACTS)
      .subscribe((val) => {
        this.listContacts = JSON.parse(val);
        if (this.listContacts !== null) {
          this.getTeepzr();
        } else {
          this.listContacts = [];
          this.getUserInfo(this.userId);
        }
      });
  }

  doRefresh(event) {
    //console.log('Begin async operation');
    setTimeout(() => {
      // console.log('Async operation has ended');
      this.getUserInfo(this.userId);
      this.getTeepzrOutCircle();
      event.target.complete();
    }, 400);
  }

  doRefreshOnContact(event) {
    setTimeout(() => {
      this.loadContacts();
      event.target.complete();
    }, 0);
  }

  trackByFn(index, item) {
    return index; // or item.id
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
          if (this.selectedTab <= 3) {
            this.selectedTab = isFirst ? 1 : this.selectedTab + 1;
          }
        } else if (swipe === "previous") {
          const isLast = this.selectedTab === 3;
          if (this.selectedTab >= 1) {
            this.selectedTab = this.selectedTab - 1;
          }
        }
      }
    }
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

  getPaginatorDataTeepzr(event) {
    // console.log(event);
    if (event.pageIndex === this.pageIndexT + 1) {
      this.lowValueT = this.lowValueT + this.pageSizeT;
      this.highValueT = this.highValueT + this.pageSizeT;
    } else if (event.pageIndex === this.pageIndex - 1) {
      this.lowValueT = this.lowValueT - this.pageSizeT;
      this.highValueT = this.highValueT - this.pageSizeT;
    }
    this.pageIndexT = event.pageIndex;
  }

  getUniques(myArray) {
    let uniqueChars = [];
    myArray.forEach((c) => {
      if (!uniqueChars.includes(c.value.toString().replace(/\s/g, ""))) {
        uniqueChars.push(c.value);
      }
    });

    return uniqueChars;
  }

  getUniquesOnContacts(myArray) {
    let hash = Object.create(null);
    let uniqueChars = [];
    myArray.forEach((c) => {
      var key = JSON.stringify(c);
      hash[key] = (hash[key] || 0) + 1;
      hash[key] >= 2 ? null : uniqueChars.push(c);
    });
    return uniqueChars;
  }

  loadContactsTest() {
    this.myContacts = this.getUniquesOnContacts(this.contactsTest);
    for (const mC of this.myContacts) {
      let inviteViaSms = {
        phone: mC.phoneNumbers[0].value,
      };
      this.subscription = this.contactService
        .checkInviteViaSms(inviteViaSms)
        .subscribe(
          (res) => {
            if (res["status"] == 201) {
              let phones = this.getUniques(mC.phoneNumbers);
              this.listContacts.push({
                givenName: mC.name.givenName,
                familyName: mC.name.familyName,
                phone: phones,
                invited: true,
              });
            } else {
              let phones = this.getUniques(mC.phoneNumbers);
              this.listContacts.push({
                givenName: mC.name.givenName,
                familyName: mC.name.familyName,
                phone: phones,
                invited: false,
              });
            }
            this.getTeepzr();
            //this.listTeepzrsToInvite.push({ _id: e['_id'], nom: e['nom'], prenom: e['prenom'], phone: e['phone'], photo: e['photo'], invited: true })
          },
          (error) => {
            this.loading = false;
          }
        );
    }
  }

  loadContacts() {
    this.loading = true;
    let options = {
      filter: "",
      multiple: true,
      hasPhoneNumber: true,
    };
    //  this.myContacts = this.contactsTest
    this.myContacts = [];
    this.listContacts = [];
    this.listTeepzrsToInvite = [];
    this.zone.runOutsideAngular(() => {
      this.arrayIncrementLoading = true;
      this.contacts.find(["name", "phoneNumbers"], options).then(
        (contacts) => {
          const contactsWithPhone = contacts.filter(
            (contact) =>
              contact.phoneNumbers && contact.phoneNumbers.length !== 0
          );
          this.myContacts = this.getUniquesOnContacts(contactsWithPhone);
          for (const mC of this.myContacts) {
            let inviteViaSms = {
              phone: mC.phoneNumbers[0].value,
            };
            this.contactService.checkInviteViaSms(inviteViaSms).subscribe(
              (res) => {
                if (res["status"] == 201) {
                  let phones = this.getUniques(mC.phoneNumbers);
                  this.listContacts.push({
                    givenName: mC.name.givenName,
                    familyName: mC.name.familyName,
                    phone: phones,
                    invited: true,
                  });
                } else {
                  let phones = this.getUniques(mC.phoneNumbers);
                  this.listContacts.push({
                    givenName: mC.name.givenName,
                    familyName: mC.name.familyName,
                    phone: phones,
                    invited: false,
                  });
                }
              },
              (error) => {
                this.loading = false;
              }
            );
          }
          this.getTeepzr();
        },
        (error) => {
          this.getTeepzr();
          if (
            this.diagnostic.permissionStatus.DENIED_ALWAYS ||
            this.diagnostic.permissionStatus.DENIED ||
            this.diagnostic.permissionStatus.DENIED_ONCE
          ) {
            this.authorizeOrNot(this.n);
          }
        }
      );
    });
  }

  authorizeOrNot(n: Boolean) {
    let authorize = {
      userId: this.userId,
      isContactAuthorized: n,
    };
    this.subscription = this.contactService
      .authorizeContacts(authorize)
      .subscribe(
        (res) => {
          console.log(res);
          this.userInfo = res["data"];
          this.n = n;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  goToOutcircle() {
    if (this.previousRoute) {
      this.router.navigate(["/tabs/tab1"], {
        replaceUrl: true,
      });
    } else {
      this.router.navigate(["/edit-profile"], {
        replaceUrl: true,
      });
    }
  }

  getTeepzr() {
    let list = [];
    this.subscription = this.contactService.teepZrs(this.userId).subscribe(
      (res) => {
        console.log(res);
        this.listTeepZrs = res["data"];
        this.contactService.setLocalData(
          CACHE_KEYS.CONTACTS,
          JSON.stringify(this.listContacts)
        );
        this.listContacts = this.getUniquesOnContacts(this.listContacts);
        this.listContacts.forEach((um) => {
          this.listTeepZrs.filter((x, index) => {
            for (const p of um.phone) {
              x["phone"].replace(/\s/g, "").slice(-7) ==
              p.replace(/\s/g, "").slice(-7)
                ? list.push({
                    _id: x["_id"],
                    prenom: um.givenName,
                    nom: um.familyName,
                    phone: x.phone,
                    photo: x.photo,
                  })
                : null;
            }
          });
        });

        this.listTeepZrs = this.getUniquesOnContacts(list);
        this.listTeepZrs.forEach((e) => {
          let invitation = { idSender: this.userId, idReceiver: e["_id"] };
          this.subscription = this.contactService
            .checkInvitationNotAccepted(invitation)
            .subscribe(
              (res) => {
                if (res["status"] == 201) {
                  this.listTeepzrsToInvite.push({
                    _id: e["_id"],
                    nom: e["nom"],
                    prenom: e["prenom"],
                    phone: e["phone"],
                    photo: e["photo"],
                    accept: e["accept"],
                    invited: true,
                  });
                } else {
                  if (!this.circleMembersId.includes(e["_id"].toString())) {
                    this.listTeepzrsToInvite.push({
                      _id: e["_id"],
                      nom: e["nom"],
                      prenom: e["prenom"],
                      phone: e["phone"],
                      photo: e["photo"],
                      accept: e["accept"],
                      invited: false,
                    });
                  }
                }
              },
              (error) => {}
            );
        });
        this.arrayIncrementLoading = false;
        if (this.listTeepzrsToInvite.length == 0) {
          this.listTeepzrsToInvite.length = 1;
          this.highValueT = this.highValueT - 1;
          this.minus = 1;
        } else {
          localStorage.setItem(
            "TeepzrToInvite",
            JSON.stringify(this.listTeepzrsToInvite)
          );
        }
      },
      (error) => {
        if (this.listTeepzrsToInvite.length == 0) {
          this.listTeepzrsToInvite.length = 1;
          this.highValueT = this.highValueT - 1;
          this.minus = 1;
        } else {
          localStorage.setItem(
            "TeepzrToInvite",
            JSON.stringify(this.listTeepzrsToInvite)
          );
        }
      }
    );
  }

  getUsersOfCircle() {
    this.loading = true;
    this.subscription = this.contactService
      .getCircleMembers(this.userId)
      .subscribe(
        (res) => {
          let circleMembers = res["data"];
          for (const cm of circleMembers) {
            this.circleMembersId.push(cm["_id"]);
          }
          //console.log(this.circleMembersId);
          this.loading = false;
        },
        (error) => {
          // console.log(error)
          this.loading = false;
        }
      );
  }
  getUniqueObject(values) {
    console.log(values);
    let list = [];
    var valueArr = values.map((item) => {
      return item.phone;
    });
    valueArr.some(function (item, idx) {
      var isDuplicate = valueArr.indexOf(item) != idx;
      if (!isDuplicate) {
        list.push(item);
      }
    });
    return list;
  }

  sendShare(c) {
    this.socialSharing
      .share(
        messageShare +
          " https://play.google.com/store/apps/details?id=bsd.teepzy.com" +
          " Et sur Apple Store via :" +
          "https://apps.apple.com/bj/app/teepzy/id1572629592?l=fr",
        null,
        ""
      )
      .then(() => {
        this.sendInvitationSmsToServer(c);
      })
      .catch((err) => {
        // alert(JSON.stringify(err))
      });
  }

  sendInvitationSmsToServer(phone) {
    let inviteViaSms = {
      senderId: this.userId,
      phone: phone,
    };
    this.subscription = this.contactService
      .inviteViaSms(inviteViaSms)
      .subscribe(
        (res) => {
          //  console.log(res)
          this.presentToast(
            this.language === "fr" ? "Invitation envoyée" : "Invitation sent"
          );
          this.listContacts.find((c, index) => {
            let phones = c.phone;
            for (const p of phones) {
              return p["value"].replace(/\s/g, "") == phone.replace(/\s/g, "")
                ? (c["invited"] = true)
                : null;
            }
          });
        },
        (error) => {
          this.presentToast(
            this.language === "fr"
              ? "Invitation non envoyée"
              : "Invitation not sent"
          );
        }
      );
  }

  dleteInvitationSmsFromServer(phone) {
    let inviteViaSms = {
      senderId: this.userId,
      phone: phone,
    };
    this.subscription = this.contactService
      .deleteInviteViaSms(inviteViaSms)
      .subscribe(
        (res) => {
          // console.log(res)
          this.presentToast(
            this.language === "fr" ? "Invitation annulée" : "Invitation cancel"
          );
          this.listContacts.find((c, index) => {
            let phones = c.phone;
            for (const p of phones) {
              return p["value"].replace(/\s/g, "") == phone.replace(/\s/g, "")
                ? (c["invited"] = false)
                : null;
            }
          });
        },
        (error) => {
          this.presentToast(
            this.language === "fr"
              ? "Invitation non annulée"
              : "Invitation not canceled"
          );
        }
      );
  }

  sendInvitationToJoinCircle(idReceiver) {
    this.loading = true;
    let invitation = {
      idSender: this.userId,
      idReceiver: idReceiver,
      typeLink: typeAccount.pseudoIntime,
    };
    this.subscription = this.contactService
      .inviteToJoinCircle(invitation)
      .subscribe(
        (res) => {
          // console.log(res)
          for (const c of this.listTeepzrsToInvite) {
            if (c !== undefined) {
              c["_id"] == idReceiver ? (c["invited"] = true) : null;
            }
          }
          this.presentToast(
            this.language === "fr"
              ? MESSAGES.INVITATION_SEND_OK
              : MESSAGES.INVITATION_SEND_OK_EN
          );
          this.loading = false;
        },
        (error) => {
          this.presentToast(
            this.language === "fr"
              ? MESSAGES.INVITATION_SEND_ERROR
              : MESSAGES.INVITATION_SEND_ERROR_EN
          );
          this.loading = false;
        }
      );
  }

  cancelInvitationToJoinCircle(u) {
    this.loading = true;
    let invitation = {
      idSender: this.userId,
      idReceiver: u._id,
    };

    this.subscription = this.contactService
      .cancelToJoinCircle(invitation)
      .subscribe(
        (res) => {
          if (res["status"] == 400) {
            this.presentToast(
              this.language === "fr"
                ? "Invitation non envoyée"
                : "Invitation not sent"
            );
            this.loading = false;
          } else {
            for (const c of this.listTeepzrsToInvite) {
              if (c !== undefined) {
                c["_id"] == u._id ? (c["invited"] = false) : null;
              }
            }
            this.presentToast(
              this.language === "fr"
                ? "Invitation annulée"
                : "Invitation cancel"
            );
            this.loading = false;
          }
        },
        (error) => {
          this.presentToast(
            this.language === "fr"
              ? "Invitation non envoyée"
              : "Invitation not sent"
          );
          this.loading = false;
        }
      );
  }

  getUserInfo(userId) {
    this.subscription = this.authService.myInfos(userId).subscribe(
      (res) => {
        // console.log(res)
        this.userInfo = res["data"];
        this.contactService.setLocalData(CACHE_KEYS.PROFILE, res["data"]);
        if (this.userInfo["isContactAuthorized"] == true) {
          this.loadContacts();
          // this.loadContactsTest();
        }
      },
      (error) => {
        // console.log(error)
      }
    );
  }

  openSnackBar(
    message: string = "Nouveaux contacts",
    action: string = "Actualiser"
  ) {
    let snackBarRef = this._snackBar.open(message, action);
    snackBarRef.onAction().subscribe(() => {
      this.getUserInfo(this.userId);
    });
  }

  async presentCancelInvitationConfirm(u) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Confirmation",
      message: "Voulez-vous vraiment annuler? ",
      buttons: [
        {
          text: "Fermer",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Je confirme",
          handler: () => {
            this.cancelInvitationToJoinCircle(u);
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlertConfirm(IdR) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header:
        this.language === "fr"
          ? MESSAGES.INVITATION_TYPE
          : MESSAGES.INVITATION_TYPE_EN,

      message: "",
      buttons: [
        {
          text: this.language === "fr" ? "Annuler" : "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            this.presentToast(this.language === "fr" ? "Annulée" : "Canceled");
          },
        },

        {
          text: this.language === "fr" ? "Confirmer" : "Confirm",
          handler: () => {
            this.sendInvitationToJoinCircle(IdR);
          },
        },
      ],
    });
    await alert.present();
  }

  goToFeed() {
    if (this.previousRoute) {
      this.router.navigate(["/tabs/tab1"], {
        replaceUrl: true,
      });
    } else {
      this.router.navigate(["/edit-profile"], {
        replaceUrl: true,
      });
    }
  }

  getTeepzrOutCircle() {
    this.subscription = this.contactService
      .eventualKnownTeepZrs(this.userId)
      .subscribe(
        (res) => {
          this.listTeepZrs = res["data"];
          this.listTeepZrs.forEach((e) => {
            let invitation = {
              idSender: this.userId,
              idReceiver: e["_id"],
            };
            this.checkInvitationOutCircle(invitation, e);
          });
          //   console.log(this.listTeepZrs)
        },
        (error) => {
          //  console.log(error)
          this.loading = false;
          this.presentToast(
            this.language === "fr"
              ? MESSAGES.ERROR_UPLOAD
              : MESSAGES.ERROR_UPLOAD_EN
          );
        }
      );
  }

  checkInvitationOutCircle(invitation, e) {
    this.subscription = this.contactService
      .checkInvitationTeepzr(invitation)
      .subscribe((res) => {
        if (res["status"] == 201) {
          this.listTeepzrsToInviteOutCircle.push({
            _id: e["_id"],
            pseudoIntime: e["pseudoIntime"],
            phone: e["phone"],
            photo: e["photo"],
            circleMembersCount: e["circleMembersCount"],
            invited: true,
          });
        } else {
          this.listTeepzrsToInviteOutCircle.push({
            _id: e["_id"],
            phone: e["phone"],
            photo: e["photo"],
            pseudoIntime: e["pseudoIntime"],
            circleMembersCount: e["circleMembersCount"],
            invited: false,
          });
        }
      });
  }

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null;
    this._snackBar.dismiss();
  }

  listSorter(array: any) {
    array.sort((a, b) =>
      a.name.givenName.localeCompare(b.name.givenName, "fr", {
        sensitivity: "base",
      })
    );
    return array;
  }

  goToProfile(userId) {
    if (this.userId === userId) {
      this.router.navigate(["/tabs/profile", { userId: userId }]);
    } else {
      this.router.navigate([
        "/profile",
        { userId: userId, previousUrl: "feed" },
      ]);
    }
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }
}
