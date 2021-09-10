import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  QueryList,
  Inject,
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
} from "../constant/constant";
import { ShareSheetPage } from "../share-sheet/share-sheet.page";
import { VgApiService } from "@videogular/ngx-videogular/core";
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

  api: VgApiService;

  videoMuted = "";
  videoUrl = "";

  @ViewChild("feed", null) feed: ElementRef;

  language = "";
  nbrTeepzrsToInvite = "";
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
    private translate: TranslateService
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

    this.getFeedNewPost().subscribe((info) => {
      // console.log(message)
      info["userConcernedId"] === this.userId ? this.openSnackBar() : null;
    });
  }

  ngOnInit() {
    this.nbrTeepzrsToInvite = localStorage.getItem("NbrTeepzrToInvite");
  }

  ionViewWillEnter() {
    this.userId = localStorage.getItem("teepzyUserId");
    this.getUserInfo(this.userId);
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

  openSnackBar(
    message: string = "Voir les Nouvelles publications",
    action: string = "Voir"
  ) {
    this._snackBar.open(message, action);
    this.getPosts(this.userId);
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

  swipeUp(event: any) {
    this.debutListPost++;
    this.endListPost++;
    if (this.endListPost > this.listPosts.length) {
      this.debutListTuto = 0;
      this.endListTuto = 1;
      this.tutosTexts();
    }
  }

  swipeDown(event: any) {
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

  onPlayerReady(api: VgApiService) {
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
  }

  initVdo() {
    this.data.play();
  }

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(
      (res) => {
        //  console.log(res)
        this.user = res["data"];
      },
      (error) => {
        // console.log(error)
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
    this.subscription = this.contactService.getPosts(userId).subscribe(
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

  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }
}
