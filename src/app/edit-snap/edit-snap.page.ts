import { Component, OnInit, Input } from '@angular/core';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-snap',
  templateUrl: './edit-snap.page.html',
  styleUrls: ['./edit-snap.page.scss'],
})
export class EditSnapPage implements OnInit {

  @Input() filePath: string;
  @Input() imgSrc: string;
  srcV;
  img;
  isPlay = false;
  post:any;
  video: any;
  isVideo = true;
  constructor(
    private webview: WebView,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.srcV = this.webview.convertFileSrc(this.filePath);
    this.img = this.imgSrc;
  }
  
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  submit(value) {
    alert(value);
  }

  changeVideo() {
    this.video = document.getElementById("video");
    if (this.video.paused) {
      this.video.play();
      this.isPlay = false;
    } else {
      this.video.pause();
      this.isPlay = true;
    }
  }
}
