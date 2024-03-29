import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  QueryList,
  Inject,
  NgZone,
} from "@angular/core";
import { AuthService } from "../providers/auth.service";
import { ContactService } from "../providers/contact.service";
import {
  ToastController,
  AlertController,
  IonSlides,
  MenuController,
  ModalController,
  IonRouterOutlet,
  ActionSheetController,
} from "@ionic/angular";
import * as moment from "moment";
import { DatapasseService } from "../providers/datapasse.service";
import { Observable, Subscription } from "rxjs";
import { LinkSheetPage } from "../link-sheet/link-sheet.page";
import { CommentsPage } from "../comments/comments.page";
//import { Socket } from 'ngx-socket-io';
import { Router, ActivatedRoute } from "@angular/router";
import { Globals } from "../globals";
import { DomSanitizer } from "@angular/platform-browser";
import {
  typeAccount,
  MESSAGES,
  CACHE_KEYS,
  Offline,
  PERMISSION,
} from "../constant/constant";
import { ShareSheetPage } from "../share-sheet/share-sheet.page";
//import { VgApiService } from "@videogular/ngx-videogular/core";
import { NetworkService } from "../providers/network.service";
import {
  animate,
  query,
  stagger,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Socket } from "ng-socket-io";
import { LikersPage } from "../likers/likers.page";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ContactsPage } from "../contacts/contacts.page";
import { TranslateService } from "@ngx-translate/core";
import { ViewsPage } from "../views/views.page";
import { Contacts } from "@ionic-native/contacts/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { PermissionModalPage } from "../permission-modal/permission-modal.page";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
  animations: [
    trigger("fadeIn", [
      transition(":enter", [
        style({ opacity: "0" }),
        animate(".5s ease-out", style({ opacity: "1" })),
      ]),
    ]),
  ],
})
export class Tab1Page implements OnInit {
  user: any;
  listPosts = [];
  posts = [];
  userId = "";
  commentT = {
    userId: "",
    postId: "",
    comment: "",
  };
  commentC = {
    userId: "",
    commentId: "",
    comment: "",
  };
  debutListPost = 0;
  endListPost = 1;

  debutListTuto = 0;
  endListTuto = 1;

  listComments = [];
  listCommentsOfComment = [];
  postId = "";
  commentId = "";
  _MS_PER_DAY = 1000 * 60 * 60 * 24;
  showSearch = false;
  showResponsePanel = false;
  search: any;
  timeCall = 0;
  repost: any;
  publication: any;
  linkModal = false;
  shareLink = false;
  users = [];
  loading = false;
  video_url = "../../assets/img/test.mp4";
  isPlaying = false;
  tutos = [];
  showBackground = false;
  global: Globals;
  subscription: Subscription;
  isAnimating = false;

  page = 1;
  navigationSubscription;
  @ViewChild("videoPlayer", null) videoPlayers: ElementRef;
  @ViewChild("slides", null) ionSlides: IonSlides;
  @ViewChild(IonSlides, null) slides: IonSlides;

  currentPlaying = null;
  currentIndex: Number = 0;

  disablePrevBtn = true;
  disableNextBtn = false;

  isTutoSkip = "";

  activeIndex = 0;
  data;

  //api: VgApiService;

  videoMuted = "";
  videoUrl = "";

  @ViewChild("feed", null) feed: ElementRef;

  language = "";
  listContacts = [];
  listTeepzrsToInvite = [];
  listTeepZrs = [];
  circleMembersId = [];
  myContacts = [];

  constructor(
    private authService: AuthService,
    private toasterController: ToastController,
    private dataPass: DatapasseService,
    public alertController: AlertController,
    private menuCtrl: MenuController,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private router: Router,
    private networkService: NetworkService,
    public globals: Globals,
    public sanitizer: DomSanitizer,
    public actionSheetController: ActionSheetController,
    private contactService: ContactService,
    private _snackBar: MatSnackBar,
    private socket: Socket,
    private translate: TranslateService,
    private zone: NgZone,
    private androidPermissions: AndroidPermissions,
    private contacts: Contacts
  ) {
    this.menuCtrl.enable(true, "first");
    this.menuCtrl.swipeGesture(false);
    this.global = globals;
    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(this.language);

    this.subscription = this.dataPass.getLike().subscribe((like) => {
      this.listPosts.find((c, index) => {
        if (like.like === true && c["_id"] === like.postId) {
          c["favorite"] = true;
          c["favoriteCount"] = c["favoriteCount"] + 1;
        }
        return true;
      });
      this.listPosts.find((c, index) => {
        if (like.like === false && c["_id"] === like.postId) {
          c["favorite"] = false;
          c["favoriteCount"] = c["favoriteCount"] - 1;
        }
        return true;
      });

      this.contactService.setLocalData(CACHE_KEYS.FEEDS_CHECK, this.listPosts);
    });

    this.subscription = this.dataPass.getPosts().subscribe((post) => {
      // console.log(list)
      if (post) {
        this.listPosts.push(post);
      }
      //  console.log(this.listPosts)
      this.listPosts = this.listPosts.sort((a, b) => {
        return parseInt(b.dateTimeStamp) - parseInt(a.dateTimeStamp);
      });
    });

    this.subscription = this.dataPass.get().subscribe((postId) => {
      // console.log(list)
      if (postId) {
        this.listPosts = this.listPosts.filter((post) => {
          return post._id !== postId;
        });
      }
      //  console.log(this.listPosts)
      this.listPosts = this.listPosts.sort((a, b) => {
        return parseInt(b.dateTimeStamp) - parseInt(a.dateTimeStamp);
      });
      this.contactService.setLocalData(CACHE_KEYS.FEEDS_CHECK, this.listPosts);
    });

    this.getFeedNewPost().subscribe((info) => {
      // console.log(message)
      info["userConcernedId"] === this.userId ? this.openSnackBar() : null;
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.userId = localStorage.getItem("teepzyUserId");
    this.getUserInfo(this.userId);
    //  this.CheckPermissions();
    if (this.networkService.networkStatus() === Offline) {
      this.getFeedFromLocal();
    } else {
      this.getFeedFromLocalThenServer();
    }
    this.isTutoSkip = localStorage.getItem("isTutoSkip");
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    this.subscription ? this.subscription.unsubscribe() : null;
  }

  setViewOnPost(post) {
    let view = {
      userId: this.userId,
      userPhoto: this.user.photo,
      userPseudo: this.user.pseudoIntime,
      postId: post._id,
    };
    this.contactService.addViewOnPost(view).subscribe(
      (res) => {
        //  console.log(res);
      },
      (error) => {
        //  console.log(error);
      }
    );
  }

  CheckPermissions() {
    const androidPermissionsList = [
      {
        key: PERMISSION.READ_CONTACTS,
        value: this.androidPermissions.PERMISSION.READ_CONTACTS,
      },
      {
        key: PERMISSION.WRITE_CONTACTS,
        value: this.androidPermissions.PERMISSION.WRITE_CONTACTS,
      },
    ];
    let checkContactRefuse = localStorage.getItem("ContactRefuseCounter");

    for (const apl of androidPermissionsList) {
      this.androidPermissions.checkPermission(apl.value).then(
        (success) => {
          if (success.hasPermission) {
            localStorage.setItem(apl.key, apl.key);
            this.loadContacts();
            // permission granted
          } else if (
            success.hasPermission === false &&
            checkContactRefuse === "2"
          ) {
          } else {
            this.presentPermissionModal();
            // this.router.navigate(["/permissions"]);
          }
        },
        (err) => {
          this.presentPermissionModal();
        }
      );
    }
  }

  async presentPermissionModal() {
    const modal = await this.modalController.create({
      component: PermissionModalPage,
      backdropDismiss: false,
      cssClass: "my-appUpdate-class",
      showBackdrop: true,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });
    return await modal.present();
  }

  openSnackBar(
    message: string = this.language === "fr"
      ? "Voir les nouvelles publications"
      : "View new posts",
    action: string = this.language === "fr" ? "Voir" : "Check"
  ) {
    let snack = this._snackBar.open(message, action);
    snack.onAction().subscribe(() => {
      this.getPosts(this.userId);
    });
  }

  openNextDataSnackBar(
    message: string = this.language === "fr"
      ? "Voir les nouvelles publications"
      : "View new posts",
    action: string = this.language === "fr" ? "Voir" : "Check"
  ) {
    let snack = this._snackBar.open(message, action);
    snack.onAction().subscribe(() => {
      this.page = 1;
      this.getPosts(this.userId);
    });
  }

  openOldDataSnackBar(
    message: string = this.language === "fr"
      ? "Voir les plus anciennes publications"
      : "View the oldest posts",
    action: string = this.language === "fr" ? "Voir" : "Check"
  ) {
    let snack = this._snackBar.open(message, action);
    snack.onAction().subscribe(() => {
      this.page++;
      this.getPosts(this.userId);
    });
  }

  time(date) {
    moment.locale(this.language);
    return moment(date).fromNow();
  }

  skipTuto() {
    let iSskip = "YES";
    localStorage.setItem("isTutoSkip", iSskip);
    this.tutos = [];
    this.isTutoSkip = localStorage.getItem("isTutoSkip");
  }

  doCheck() {
    console.log("slide change");
    let prom1 = this.ionSlides.isBeginning();
    let prom2 = this.ionSlides.isEnd();

    Promise.all([prom1, prom2]).then((data) => {
      data[0] ? (this.disablePrevBtn = true) : (this.disablePrevBtn = false);
      data[1] ? (this.disableNextBtn = true) : (this.disableNextBtn = false);
    });
  }

  swipeEvents(event) {
    ///console.log('swipe');
    this.listPosts.length == 0 ? this.getPosts(this.userId) : null;
  }

  tutosTexts() {
    this.contactService.tutotxts().subscribe((res) => {
      this.tutos = res;
      console.log(this.tutos);
    });
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

  getSlideIndex() {
    // console.log(this.isElementInViewPort(this.videoPlayers.nativeElement))
    this.slides.getActiveIndex().then((index) => {
      this.currentIndex = index;
      //   console.log(this.currentIndex)
    });
  }

  dismissShareSheet() {
    if (this.shareLink) {
      this.shareLink = false;
    } else {
      this.shareLink = true;
    }
  }

  stopVideo() {
    if (this.videoPlayers) {
      // console.log(this.videoPlayers)
      const nativeElement = this.videoPlayers.nativeElement;
      this.currentPlaying = nativeElement;
      this.currentPlaying.muted = true;
      this.currentPlaying.pause();
      this.currentPlaying = null;
    }
  }

  unMute() {
    const nativeElement = this.videoPlayers.nativeElement;
    if (!this.isElementInViewPort(nativeElement)) {
      this.videoMuted = "";
      this.videoPlayers.nativeElement.pause();
    }

    //  this.onPlayerPause(this.api)
  }

  isElementInViewPort(el) {
    const rect = el.getBoundingClientRect();
    const viewHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight
    );
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
  }

  swipeUp(event: any, post) {
    this.setViewOnPost(post);
    this.debutListPost++;
    this.endListPost++;
    this.endListPost === 19 ? this.openOldDataSnackBar() : null;
    if (this.endListPost > 19) {
      this.debutListTuto = 0;
      this.endListTuto = 1;
      this.tutosTexts();
    }
  }

  swipeDown(event: any, post) {
    this.page > 1 ? this.openNextDataSnackBar() : null;
    if (this.debutListPost > 0) {
      this.debutListPost--;
      this.endListPost--;
    } else if (this.debutListPost === 0) {
      this.debutListPost = 0;
    }
  }

  swipeUPTuto() {
    //tuto swipes
    if (this.endListTuto < this.tutos.length) {
      this.debutListTuto++;
      this.endListTuto++;
    }
  }

  swipeDownTuto() {
    //tuto swipes
    this.debutListTuto--;
    this.endListTuto--;
    if (this.debutListTuto === 0) {
      this.debutListPost = this.listPosts.length - 1;
      this.endListPost = this.listPosts.length;
    }
  }

  showShareSheet(post) {
    if (post) {
      this.repost = {
        postId: post["_id"],
        fromId: post["userId"],
        reposterId: this.userId,
        userPhoto_url: post["userPhoto_url"],
        userPseudo: post["userPseudo"],
        content: post["content"],
        image_url: post["image_url"],
        backgroundColor: post["backgroundColor"],
        includedCircles: post["includedCircles"],
      };
    }

    if (this.shareLink) {
      this.shareLink = false;
    } else {
      this.shareLink = true;
    }
  }

  doRefresh(event) {
    setTimeout(() => {
      if (this.debutListPost === 0) this.getPosts(this.userId);
      event.target.complete();
    }, 400);
  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  videoPlayerInit(data) {
    this.data = data;
    this.data
      .getDefaultMedia()
      .subscriptions.loadedMetadata.subscribe(this.initVdo.bind(this));
  }

  /* onPlayerReady(api: VgApiService) {
    this.api = api;
    this.api.getDefaultMedia().subscriptions.ended.subscribe(() => {
      // Set the video to the beginning
      this.api.getDefaultMedia().currentTime = 0;
      //   console.log(this.api.getDefaultMedia().currentTime)
    });
  }

  onPlayerPause(api: VgApiService) {
    this.api = api;
    this.api.getDefaultMedia().subscriptions.ended.subscribe(() => {
      // Set the video to the beginning
      this.api.getDefaultMedia().currentTime = 0;
    });
  }*/

  initVdo() {
    this.data.play();
  }

  getUserInfo(userId) {
    console.log("lets go");
    this.authService.myInfos(userId).subscribe(
      (res) => {
        console.log(res);
        console.log(res["data"].pseudoIntime + "****************");
        this.user = res["data"];
      },
      (error) => {
        console.log("error");
        console.log(error);
      }
    );
  }

  async goToContacts() {
    // this.router.navigate(["/contacts", { previousUrl: "feeds" }]);
    const modal = await this.modalController.create({
      component: ContactsPage,
      componentProps: { previousUrl: "feeds" },
      cssClass: "likers-class",
      backdropDismiss: false,
      showBackdrop: true,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });
    return await modal.present();
  }

  goToSearch() {
    this.router.navigateByUrl("/search");
  }

  goToProfile(userId) {
    // console.log(userId, reposterId)
    if (this.userId === userId) {
      this.router.navigate(["/tabs/profile", { userId: userId }]);
    } else {
      this.router.navigate([
        "/profile",
        { userId: userId, previousUrl: "feed" },
      ]);
    }
  }

  async presentLinkModal(post, typeMatch) {
    if (this.globals.showBackground) {
      this.globals.showBackground = false;
    } else {
      this.globals.showBackground = true;
    }
    const modal = await this.modalController.create({
      component: LinkSheetPage,
      componentProps: { post: post, typeMatch: typeMatch },
      backdropDismiss: false,
      showBackdrop: true,
      cssClass: "linkto-class",
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });
    return await modal.present();
  }

  async presentShareModal(post) {
    if (this.globals.showBackground) {
      this.globals.showBackground = false;
    } else {
      this.globals.showBackground = true;
    }
    const modal = await this.modalController.create({
      component: ShareSheetPage,
      componentProps: post,
      cssClass: "likers-class",
      backdropDismiss: false,
      showBackdrop: true,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });
    return await modal.present();
  }

  async presentCommentModal(post) {
    if (this.globals.showBackground) {
      this.globals.showBackground = false;
    } else {
      this.globals.showBackground = true;
    }
    const modal = await this.modalController.create({
      component: CommentsPage,
      componentProps: post,
      backdropDismiss: false,
      cssClass: "comment-class",
      showBackdrop: true,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });
    return await modal.present();
  }

  async presentLikersModal(post) {
    if (this.globals.showBackground) {
      this.globals.showBackground = false;
    } else {
      this.globals.showBackground = true;
    }
    const modal = await this.modalController.create({
      component: LikersPage,
      componentProps: post,
      backdropDismiss: false,
      cssClass: "likers-class",
      showBackdrop: true,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });
    return await modal.present();
  }

  async presentViewersModal(post) {
    if (this.globals.showBackground) {
      this.globals.showBackground = false;
    } else {
      this.globals.showBackground = true;
    }
    const modal = await this.modalController.create({
      component: ViewsPage,
      componentProps: post,
      backdropDismiss: false,
      cssClass: "likers-class",
      showBackdrop: true,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });
    return await modal.present();
  }

  pauseOrPlay(video) {
    video.pause();
  }

  getFeedNewPost() {
    let observable = new Observable((observer) => {
      this.socket.on("user-new-post", (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getFeedFromLocalThenServer() {
    this.subscription = this.contactService
      .feedsFromLocal()
      .subscribe((listPosts) => {
        listPosts.length > 0
          ? (this.listPosts = listPosts)
          : (this.listPosts = []);
        this.getPosts(this.userId);
      });
  }

  getPosts(userId) {
    this.timeCall = 1;
    this.listPosts.length === 0 ? (this.loading = true) : null;
    this.loading = true;
    this.subscription = this.contactService
      .getPostsOnFeed(userId, this.page)
      .subscribe(
        (res) => {
          this.listPosts = [];
          if (res["data"] != null) {
            this.listPosts = res["data"];
            this.listPosts = this.listPosts.sort((a, b) => {
              return parseInt(b.dateTimeStamp) - parseInt(a.dateTimeStamp);
            });
            this.debutListPost = 0;
            this.endListPost = 1;
            this.contactService.setLocalData(
              CACHE_KEYS.FEEDS_CHECK,
              this.listPosts
            );
          } else {
            this.listPosts = [];
            this.tutosTexts();
          }
          this.loading = false;
          this.timeCall = 0;
        },
        (error) => {
          this.tutosTexts();
          this.loading = false;
          console.log(error);
        }
      );
  }

  getFeedFromLocal() {
    this.subscription = this.contactService
      .feedsFromLocal()
      .subscribe((listPosts) => {
        listPosts ? (this.listPosts = listPosts) : (this.listPosts = []);
        return listPosts;
      });
  }

  async changePseudo() {
    const actionSheet = await this.actionSheetController.create({
      header: "Changer de compte",
      buttons: [
        {
          text: "@" + this.user.pseudoPro,
          handler: () => {
            // this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
            this.changeAccount(typeAccount.pseudoPro);
          },
        },
        {
          text: "@" + this.user.pseudoIntime,
          handler: () => {
            // this.pickVideo(this.camera.PictureSourceType.PHOTOLIBRARY);
            this.changeAccount(typeAccount.pseudoIntime);
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

  changeAccount(typeAccount) {
    let change = {
      typeCircle: typeAccount,
      userId: this.userId,
    };
    this.contactService.changeAccount(change).subscribe(
      (res) => {
        //   console.log(res)
        this.presentToast(
          this.language === "fr" ? "compte changé" : "account changed"
        );
        this.getUserInfo(this.userId);
      },
      (error) => {
        // console.log(error)
      }
    );
  }

  showLinkModal(p) {
    this.publication = p;
    if (this.linkModal) {
      this.linkModal = false;
    } else {
      this.linkModal = true;
    }
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

  getUniques(myArray) {
    let uniqueChars = [];
    myArray.forEach((c) => {
      if (!uniqueChars.includes(c.value.toString().replace(/\s/g, ""))) {
        uniqueChars.push(c.value);
      }
    });

    return uniqueChars;
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
        }
      );
    });
  }

  getTeepzr() {
    let list = [];
    this.subscription = this.contactService.teepZrs(this.userId).subscribe(
      (res) => {
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
      },
      (error) => {}
    );
  }

  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }
}
