import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tuto-video',
  templateUrl: './tuto-video.page.html',
  styleUrls: ['./tuto-video.page.scss'],
})
export class TutoVideoPage implements OnInit {

  video_url = "https://api.teepzy.com/intro.mp4"
  //"../../assets/video/VID-20200802-WA0032.mp4"

  constructor(
    public sanitizer: DomSanitizer,
    private router: Router
  ) {

  }

  ngOnInit() {
  }

  done() {
    this.router.navigate(['/permissions', { previousUrl: 'tuto' }], {
      replaceUrl: true,

    })
  }
}
