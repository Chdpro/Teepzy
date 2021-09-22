import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import {
  ModalController,
  NavParams,
  ToastController,
  MenuController,
} from "@ionic/angular";
import { ContactService } from "../providers/contact.service";
//import { Socket } from 'ngx-socket-io';
import { DatapasseService } from "../providers/datapasse.service";
import { Globals } from "../globals";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "../providers/auth.service";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.page.html",
  styleUrls: ["./comments.page.scss"],
})
export class CommentsPage implements OnInit {
  listComments = [];

  commentT = {
    userId: "",
    postId: "",
    comment: "",
    userPseudo: "",
    userPhoto: "",
  };

  commentC = {
    userId: "",
    commentId: "",
    comment: "",
    userPseudo: "",
    userPhoto: "",
  };

  listCommentsOfComment = [];

  postId = "";
  commentId = "";
  userId = "";
  showResponsePanel = false;

  subscription: Subscription;
  @ViewChild("myInput", null) myInput: ElementRef;

  members = [];
  loading = false;
  user: any;
  constructor(
    private modalController: ModalController,
    private contactService: ContactService,
    private toasterController: ToastController,
    private translate: TranslateService,
    //    private socket: Socket,
    public globals: Globals,
    private menuCtrl: MenuController,
    private dataPasse: DatapasseService,
    private navParams: NavParams,
    private authService: AuthService
  ) {
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);

    let language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(language);
  }

  ngOnInit() {
    let post = this.navParams.data;
    this.getCommentsOfPost(post["_id"]);
    this.userId = localStorage.getItem("teepzyUserId");
    this.getUser();
    this.getUsersOfCircle();
  }

  getUsersOfCircle() {
    this.contactService.getCircleMembers(this.userId).subscribe(
      (res) => {
        //console.log(res);
        this.members = res["data"];
      },
      (error) => {
        // console.log(error)
      }
    );
  }

  resize() {
    this.myInput.nativeElement.style.height =
      this.myInput.nativeElement.scrollHeight + "px";
  }

  getCommentsOfPost(postId) {
    this.loading = true;
    this.postId = postId;
    this.contactService.getCommentsOfPost(postId).subscribe(
      (res) => {
        // console.log(res);
        this.loading = false;
        this.listComments = res["data"];
      },
      (error) => {
        //   console.log(error)
        this.loading = false;
      }
    );
  }

  addCommentToPost() {
    this.commentT.userId = this.userId;
    this.commentT.postId = this.postId;
    this.commentT.userPhoto = this.user.photo;
    this.commentT.userPseudo = this.user.pseudoIntime;

    this.contactService.addCommentToPost(this.commentT).subscribe((res) => {
      if (res["status"] == 200) {
        this.commentT.comment = "";
        this.listComments.unshift(this.commentT);
      }
    });
  }
  getUser() {
    console.log(this.userId);
    this.authService.myInfos(this.userId).subscribe(
      (res) => {
        this.user = res["data"];
        console.log(this.user);
        console.log(this.userId);
      },
      (error) => {
        // console.log(error)
      }
    );
  }

  addCommentToComment() {
    this.commentC.userId = this.userId;
    this.commentC.commentId = this.commentId;
    this.commentC.userPhoto = this.user.photo;
    this.commentC.userPseudo = this.user.pseudoIntime;
    this.contactService.addCommentToComment(this.commentC).subscribe(
      (res) => {
        if (res["status"] == 200) {
          this.commentC.comment = "";
          this.listCommentsOfComment.push(this.commentC);
        }
      },
      (error) => {}
    );
  }

  getCommentsOfComment(commentId) {
    this.showResPanel();
    this.commentId = commentId;
    this.contactService.getCommentsOfComment(commentId).subscribe(
      (res) => {
        // console.log(res);
        this.listCommentsOfComment = res["data"];
      },
      (error) => {
        //  console.log(error)
      }
    );
  }

  showResPanel() {
    //  console.log('show panel')
    this.showResponsePanel
      ? (this.showResponsePanel = false)
      : (this.showResponsePanel = true);
  }

  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  ionViewWillLeave() {
    // this.socket.disconnect();
    // console.log('disconnected')
    this.subscription ? this.subscription.unsubscribe() : null;
  }

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null;
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
