import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-tuto-video",
  templateUrl: "./tuto-video.page.html",
  styleUrls: ["./tuto-video.page.scss"],
})
export class TutoVideoPage implements OnInit {
  video_url = "http://192.168.1.42:5001/intro.mp4";
  // video_url = "https://api.teepzy.com/intro.mp4";
  //"../../assets/video/VID-20200802-WA0032.mp4"

  constructor(
    public sanitizer: DomSanitizer,
    private router: Router,
    private translate: TranslateService
  ) {
    let language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(language);
  }

  ngOnInit() {}

  done() {
    this.router.navigate(["/permissions", { previousUrl: "tuto" }], {
      replaceUrl: true,
    });
  }
}
