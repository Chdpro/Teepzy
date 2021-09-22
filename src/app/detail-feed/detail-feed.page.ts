import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ContactService } from "../providers/contact.service";
import { AuthService } from "../providers/auth.service";
import {
  ToastController,
  AlertController,
  MenuController,
  ModalController,
  IonRouterOutlet,
  Platform,
  ActionSheetController,
} from "@ionic/angular";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { LinkSheetPage } from "../link-sheet/link-sheet.page";
import { CommentsPage } from "../comments/comments.page";
import { Router, ActivatedRoute } from "@angular/router";
import { Globals } from "../globals";
import { ShareSheetPage } from "../share-sheet/share-sheet.page";
import { EditPostPage } from "../edit-post/edit-post.page";
import { DatapasseService } from "../providers/datapasse.service";
import { type, MESSAGES } from "../constant/constant";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { ViewsPage } from "../views/views.page";
import { LikersPage } from "../likers/likers.page";

@Component({
  selector: "app-detail-feed",
  templateUrl: "./detail-feed.page.html",
  styleUrls: ["./detail-feed.page.scss"],
})
export class DetailFeedPage implements OnInit {
  user: any;

  listPosts = [];
  post: any;
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

  listComments = [];
  listCommentsOfComment = [];

  postId = "";
  commentId = "";

  _MS_PER_DAY = 1000 * 60 * 60 * 24;

  showSearch = false;
  showResponsePanel = false;

  search = "";
  subscription: Subscription;
  timeCall = 0;
  repost: any;

  publication: any;
  linkModal = false;
  shareLink = false;

  users = [];

  isPlaying = false;
  showBackground = false;
  global: Globals;
  navigationSubscription;

  currentPlaying = true;
  @ViewChild("videoPlayer", null) videoPlayers: ElementRef;
  @ViewChild("slideWrapper", null) wrapper: ElementRef;

  previousRoute = "";

  previousBackUrl = "";

  slideOpts = {
    initialSlide: 1,
    speed: 400,
  };

  loading: Boolean;
  language = "";

  constructor(
    private authService: AuthService,
    private toasterController: ToastController,
    public alertController: AlertController,
    private menuCtrl: MenuController,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    public sanitizer: DomSanitizer,
    private router: Router,
    public globals: Globals,
    public route: ActivatedRoute,
    private platform: Platform,
    private dataPasse: DatapasseService,
    private contactService: ContactService,
    private translate: TranslateService,
    private actionSheetController: ActionSheetController,
    private dataPass: DatapasseService
  ) {
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);
    this.global = globals;
    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(this.language);

    this.subscription = this.dataPass.getLike().subscribe((like) => {
      if (like.like === true && this.post["_id"] === like.postId) {
        this.post["favorite"] = true;
        this.post["favoriteCount"] = this.post["favoriteCount"] + 1;
      }
      if (like.like === false && this.post["_id"] === like.postId) {
        this.post["favorite"] = false;
        this.post["favoriteCount"] = this.post["favoriteCount"] - 1;
      }
      return true;
    });

    this.previousRoute = this.route.snapshot.paramMap.get("previousUrl");
    this.subscription = this.dataPasse.get().subscribe((p) => {
      if (p) {
        this.post = p;
      }
    });

    this.subscription = this.dataPass
      .getPostDeletedId()
      .subscribe((postIdDeleted) => {
        console.log(postIdDeleted);
        postIdDeleted ? this.router.navigateByUrl("/tabs/profile") : null;
      });
  }

  ionViewWillEnter() {
    this.userId = localStorage.getItem("teepzyUserId");
    this.getUserInfo(this.userId);
    let idTeepz = this.route.snapshot.paramMap.get("idTeepz");
    this.previousBackUrl = this.route.snapshot.paramMap.get("previousBackUrl");
    this.getAPost(idTeepz);
    this.getRepost(idTeepz);
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      if (this.platform.is("android")) {
        // console.log(this.OS);
      } else if (this.platform.is("ios")) {
      }
    });
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

  getAPost(idTeepz) {
    let post = {
      idPost: idTeepz,
      userId: this.userId,
    };
    this.loading = true;
    this.contactService.getPost(post).subscribe(
      (res) => {
        let post = res["data"];
        if (post) {
          let favorite = {
            userId: this.userId,
            postId: post._id,
          };
          this.setViewOnPost(post);
          this.checkFavorite(favorite, post);
          this.loading = false;
        }
      },
      (error) => {
        //  console.log(error)
        this.loading = false;
      }
    );
  }

  getRepost(idTeepz) {
    let post = {
      idPost: idTeepz,
      userId: this.userId,
    };
    this.loading = true;
    this.contactService.getRePost(post).subscribe(
      (res) => {
        this.post == null ? (this.post = res["data"]) : null;
        if (this.post) {
          let favorite = {
            userId: this.userId,
            postId: this.post._id,
          };
          this.setViewOnPost(post);
          this.checkFavorite(favorite, this.post);
        }
        this.loading = false;
      },
      (error) => {
        //  console.log(error)
        this.loading = false;
      }
    );
  }

  async presentPostEditModal() {
    const modal = await this.modalController.create({
      component: EditPostPage,
      componentProps: this.post,
      cssClass: "edit-post-custom-class",
      presentingElement: this.routerOutlet.nativeEl,
    });
    return await modal.present();
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      cssClass: "my-custom-class",
      buttons: [
        {
          text: this.language === "fr" ? "Supprimer?" : "Delete?",
          role: "destructive",
          icon: "trash",
          handler: () => {
            this.deletePost();
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

  getMyPosts(userId) {
    this.contactService.teepZ(userId).subscribe(
      (res) => {
        //  console.log(res)
        let listTeepz = res["data"];
        this.dataPasse.sendPosts(listTeepz);
      },
      (error) => {
        // console.log(error)
      }
    );
  }

  getMyFavoritePosts(userId) {
    this.contactService.favorites(userId).subscribe(
      (res) => {
        //  console.log(res)
        let listFavorites = res["data"];
        this.dataPasse.sendFavorite(listFavorites);
      },
      (error) => {
        // console.log(error)
      }
    );
  }

  deletePost() {
    this.contactService.deletePost(this.post._id, this.userId).subscribe(
      (res) => {
        this.getMyPosts(this.userId);
        this.getMyFavoritePosts(this.userId);
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.DELETE_FEED_OK
            : MESSAGES.DELETE_FEED_OK_EN
        );
        this.router.navigateByUrl("/tabs/profile");
      },
      (error) => {
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.DELETE_FEED_ERROR
            : MESSAGES.DELETE_FEED_ERROR_EN
        );
      }
    );
  }

  playVideo(videoUrl?: any) {
    if (videoUrl) {
      if (this.currentPlaying) {
        this.videoPlayers.nativeElement = document.getElementById(videoUrl);
        const nativeElement = this.videoPlayers.nativeElement;
        nativeElement.pause();
        this.currentPlaying = false;
      } else {
        this.videoPlayers.nativeElement = document.getElementById(videoUrl);
        const nativeElement = this.videoPlayers.nativeElement;
        nativeElement.play();
        this.currentPlaying = true;
      }
    }
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

  trackByFn(index, item) {
    return index; // or item.id
  }

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(
      (res) => {
        //console.log(res)
        this.user = res["data"];
      },
      (error) => {
        //console.log(error)
      }
    );
  }

  goToContacts() {
    this.router.navigate(["/contacts", { previousUrl: "feeds" }]);
  }

  goToSearch() {
    this.router.navigateByUrl("/search");
  }

  addFavorite(post) {
    let favoris = {
      userId: this.userId,
      postId: post._id,
      type: type.POST,
    };
    this.contactService.addFavorite(favoris).subscribe(
      (res) => {
        //  this.socket.emit('notification', 'notification');
        //console.log(res)
        this.post = {
          _id: post["_id"],
          userId: post["userId"],
          userPhoto_url: post["userPhoto_url"],
          userPseudo: post["userPseudo"],
          content: post["content"],
          image_url: post["image_url"],
          backgroundColor: post["backgroundColor"],
          includedUsers: post["includedUsers"],
          createdAt: post["createdAt"],
          reposterId: post["reposterId"],
          favorite: false,
        };
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.FAVORITE_OK
            : MESSAGES.FAVORITE_OK_EN
        );
      },
      (error) => {
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.FAVORITE_ERROR
            : MESSAGES.FAVORITE_ERROR_EN
        );
      }
    );
  }

  removeFavorite(post) {
    let favoris = {
      userId: this.userId,
      postId: post._id,
    };
    this.contactService.removeFavorite(favoris).subscribe(
      (res) => {
        // console.log(res)
        this.post = {
          _id: post["_id"],
          userId: post["userId"],
          userPhoto_url: post["userPhoto_url"],
          userPseudo: post["userPseudo"],
          content: post["content"],
          image_url: post["image_url"],
          backgroundColor: post["backgroundColor"],
          includedUsers: post["includedUsers"],
          createdAt: post["createdAt"],
          reposterId: post["reposterId"],
          favorite: false,
        };

        this.presentToast(
          this.language === "fr"
            ? MESSAGES.REMOVE_FAVORITE_OK
            : MESSAGES.REMOVE_FAVORITE_OK_EN
        );
      },
      (error) => {
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.REMOVE_FAVORITE_ERROR
            : MESSAGES.REMOVE_FAVORITE_ERROR_EN
        );
        // console.log(error)
      }
    );
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

  time(date) {
    moment.locale(this.language);
    return moment(date).fromNow();
  }

  checkFavorite(favorite, e) {
    this.contactService.checkFavorite(favorite).subscribe((res) => {
      if (res["status"] == 201) {
        this.post = {
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
          favorite: true,
          nbrComments: e["nbrComments"],
          favoriteCount: e["favoriteCount"],
          repostCounts: e["repostCounts"],
          matches: e["matches"],
          commercialAction: e["commercialAction"],
          price: e["price"],
          views: e["views"],
        };
      } else {
        this.post = {
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
          favorite: false,
          nbrComments: e["nbrComments"],
          favoriteCount: e["favoriteCount"],
          repostCounts: e["repostCounts"],
          matches: e["matches"],
          commercialAction: e["commercialAction"],
          price: e["price"],
          views: e["views"],
        };
      }
    });
  }

  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }
}
