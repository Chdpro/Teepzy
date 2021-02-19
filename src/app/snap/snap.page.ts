import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  ModalController, MenuController, Platform,
} from '@ionic/angular';
import {
  CameraPreview,
  CameraPreviewPictureOptions,
} from "@ionic-native/camera-preview/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { EditSnapPage } from '../edit-snap/edit-snap.page';
import { EditSnapImgPage } from '../edit-snap-img/edit-snap-img.page';
import { DatapasseService } from '../providers/datapasse.service';


@Component({
  selector: 'app-snap',
  templateUrl: './snap.page.html',
  styleUrls: ['./snap.page.scss'],
  // encapsulation: ViewEncapsulation.None,

})
export class SnapPage implements OnInit {


  post = {
    content: ''
  }
  // Camera preview variable
  picture;
  cameraActive = false;
  torchActive = false;
  isRecording = false;
  srcV;
  time: BehaviorSubject<string> = new BehaviorSubject("00:00");
  timer: number;
  interval;
  captureI: any;
  isFlash;

  constructor(
    private cameraPreview: CameraPreview,
    private router: Router,
    private webview: WebView,
    private androidPermissions: AndroidPermissions,
    private modalController: ModalController,
    private menuCtrl: MenuController,
    private platform: Platform,
    private dataPasse: DatapasseService
  ) {
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);

    this.captureI = document.getElementById("captureI");
    this.isFlash = 2;
    this.cameraPreview.setFlashMode(this.cameraPreview.FLASH_MODE.OFF);

    // handle back button to go to feed page
    this.platform.backButton.subscribeWithPriority(10, () => {
      router.navigate(['/tabs/tab1'])
    });
  }

  ngOnInit() {
    this.captureI = document.getElementById("captureI");
    this.captureI.setAttribute("color", "light");
    this.initCamera()
  }


  initCamera() {
    this.requestNecessaryPermissions().then(() => {
      const cameraPreviewOpts = {
        x: 0,
        y: 0,
        width: window.screen.width,
        height: window.screen.height,
        camera: this.cameraPreview.CAMERA_DIRECTION.BACK,
        tapPhoto: true,
        tapFocus: false,
        previewDrag: false,
        toBack: true,
      };
      // start camera
      this.cameraPreview.startCamera(cameraPreviewOpts).then(
        (res) => {
          this.cameraActive = true;
        },
        (err) => {
        }
      );
    });
  }

  requestNecessaryPermissions() {
    // Change this array to conform with the permissions you need
    const androidPermissionsList = [
      this.androidPermissions.PERMISSION.CAMERA,
      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
      this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
      this.androidPermissions.PERMISSION.READ_PHONE_STATE,
      this.androidPermissions.PERMISSION.WRITE_PHONE_STATE,
      this.androidPermissions.PERMISSION.RECORD_AUDIO,
      this.androidPermissions.PERMISSION.RECORD_VIDEO,
      this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,

    ];
    return this.androidPermissions.requestPermissions(androidPermissionsList);
  }

  startTimer() {
    this.timer = 0;
    this.interval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }
  updateTime() {
    let minute: any = this.timer / 60;
    let second: any = this.timer % 60;

    minute = String("0" + Math.floor(minute)).slice(-2);
    second = String("0" + Math.floor(second)).slice(-2);

    const text = minute + ":" + second;
    this.time.next(text);
    ++this.timer;

    if (this.timer > 15) {
      clearInterval(this.interval);
      this.stopVideoRecode();
    }
  }

  stopTimer() {
    clearInterval(this.interval);
    this.time.next("00:00");
  }

  /**
   * Close the camera
   */
  closeCamera() {
    this.cameraPreview.stopCamera();
    this.cameraActive = false;
    this.router.navigate(['/tabs/tab1'])

  }

  /**
   * Switch the camera
   */
  switchCamera() {
    this.cameraPreview.switchCamera();
  }


  stopVideoRecode() {
    this.captureI = document.getElementById("captureI");
    this.captureI.setAttribute("color", "light");
    this.cameraPreview.stopRecordVideo().then((filePath) => {
      console.log("file://" + filePath);
      const pictureOpts = {
        quality: 85,
      };

      // take a picture
      this.cameraPreview.takeSnapshot(pictureOpts).then(
        (base64PictureData) => {
          const pictures = "data:image/jpeg;base64," + base64PictureData;
          this.srcV = this.webview.convertFileSrc("file://" + filePath);
          this.captureI.setAttribute("color", "light");
          let video = {
            file: "file://" + filePath,
            filePath: filePath,
            base64: pictures
          }
          this.dataPasse.sendVideo(video)
          this.dismiss()

          // alert("file://" + filePath)
          //this.presentModal("file://" + filePath, pictures);
        },
        (err) => {
          console.log(err);
          // this.picture = "assets/img/test.jpg";
        }
      );

      // alert(this.srcV);
      this.isRecording = false;
    });
  }
  /**
   * Take a picture
   */
  takeVideoRecord() {
    this.captureI = document.getElementById("captureI");
    console.log(this.captureI);
    this.captureI.setAttribute("color", "danger");
    const opt = {
      cameraDirection: this.cameraPreview.CAMERA_DIRECTION.BACK,
      width: window.screen.width,
      height: window.screen.height,
      quality: 100,
      withFlash: false,
      duration: 15
    };
    this.cameraPreview.startRecordVideo(opt);
    this.isRecording = true;
    this.startTimer();
  }

  /**
   * Send a picture
   */
  sendPicture() { }

  onFlash() {
    this.cameraPreview.setFlashMode(this.cameraPreview.FLASH_MODE.ON);
    this.isFlash = 3;
  }
  offFlash() {
    this.cameraPreview.setFlashMode(this.cameraPreview.FLASH_MODE.OFF);
    this.isFlash = 1;
  }
  autoFlash() {
    this.cameraPreview.setFlashMode(this.cameraPreview.FLASH_MODE.AUTO);
    this.isFlash = 2;
  }

  async presentModal(path, src) {
    const modal = await this.modalController.create({
      component: EditSnapPage,
      cssClass: "my-custom-class",
      componentProps: {
        filePath: path,
        imgSrc: src,
        page: "snap"
      },
    });
    return await modal.present();
  }

  async presentModalImg(path, imgData?: any) {
    const modal = await this.modalController.create({
      component: EditSnapImgPage,
      cssClass: "my-custom-class",
      componentProps: {
        filePath: path,
        imageData: imgData
      },
    });
    return await modal.present();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
