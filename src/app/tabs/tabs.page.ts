import { Component } from "@angular/core";
import { ModalController, IonTabs } from "@ionic/angular";
import { AddPostPage } from "../add-post/add-post.page";
import { Router } from "@angular/router";
import { ContactService } from "../providers/contact.service";
import { Socket } from "ng-socket-io";
import { Subscription } from "rxjs";
//import { Socket } from 'ngx-socket-io';
//import { Observable } from 'rxjs';

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
})
export class TabsPage {
  private activeTab?: HTMLElement;
  subscription: Subscription;
  userId = "";
  nrbrNotifications = 0;
  nrbrMessages = 0;

  constructor(
    public modalController: ModalController,
    private contactService: ContactService,
    private socket: Socket,
    // private socket: Socket,
    private router: Router
  ) {
    this.userId = localStorage.getItem("teepzyUserId");
    this.nbrUnreadNotifications();
  }

  ionViewWillEnter() {
    this.propagateToActiveTab("ionViewWillEnter");
    this.nbrUnreadMessages();
  }

  tabChange(tabsRef: IonTabs) {
    //tabsRef.outlet.activatedRoute
    // this.activeTab = tabsRef.outlet.activatedView.element;
  }

  ionViewWillLeave() {
    this.propagateToActiveTab("ionViewWillLeave");
    //  this.socket.disconnect();
  }

  ionViewDidLeave() {
    this.propagateToActiveTab("ionViewDidLeave");
  }

  ionViewDidEnter() {
    this.propagateToActiveTab("ionViewDidEnter");
  }

  private propagateToActiveTab(eventName: string) {
    if (this.activeTab) {
      this.activeTab.dispatchEvent(new CustomEvent(eventName));
    }
  }

  AddPostPage() {
    this.router.navigate(["/add-post"]);
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddPostPage,
      cssClass: "my-custom-class",
    });
    return await modal.present();
  }

  getOnline() {
    let user = { userId: this.userId, onlineDate: new Date(), adress: {} };
    this.socket.emit("online", user);
  }

  unreads() {
    this.nbrUnreadMessages();
    this.nbrUnreadNotifications();
    this.getOnline();
  }
  nbrUnreadNotifications() {
    this.subscription = this.contactService
      .NbrUnreadNotifications(this.userId)
      .subscribe(
        (res) => {
          this.nrbrNotifications = res["data"];
        },
        (error) => {
          //  console.log(error)
        }
      );
  }

  nbrUnreadMessages() {
    let user = { currentUserOnlineId: this.userId };
    this.subscription = this.contactService.nrbrUnreadMessages(user).subscribe(
      (res) => {
        this.nrbrMessages = res["data"];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null;
  }
}
