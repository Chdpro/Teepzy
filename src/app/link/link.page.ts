import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MenuController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-link",
  templateUrl: "./link.page.html",
  styleUrls: ["./link.page.scss"],
})
export class LinkPage implements OnInit {
  subscription: Subscription;
  language = "";
  constructor(
    private router: Router,
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
  goToContacts() {
    this.router.navigate(["/contacts"], {
      replaceUrl: true,
    });
  }

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null;
  }
}
