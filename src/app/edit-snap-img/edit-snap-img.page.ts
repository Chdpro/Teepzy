import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Component({
  selector: 'app-edit-snap-img',
  templateUrl: './edit-snap-img.page.html',
  styleUrls: ['./edit-snap-img.page.scss'],
})
export class EditSnapImgPage implements OnInit {
  @Input() filePath: string;
  srcV;
  post:any;
  constructor(
    private webview: WebView,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.srcV = "data:image/jpeg;base64," + this.filePath;
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
}
