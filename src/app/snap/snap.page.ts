import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  ModalController, ToastController, AlertController,
  ActionSheetController, MenuController, Platform, GestureController, Gesture
} from '@ionic/angular';
import {
  CameraPreview,
  CameraPreviewPictureOptions,
} from "@ionic-native/camera-preview/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { VideoPlayer } from "@ionic-native/video-player/ngx";
import { Media, MediaObject } from "@ionic-native/media/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import {
  StreamingMedia,
  StreamingVideoOptions,
} from "@ionic-native/streaming-media/ngx";
import { VideoEditor } from "@ionic-native/video-editor/ngx";
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FilePath } from '@ionic-native/file-path/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { EditSnapPage } from '../edit-snap/edit-snap.page';
import { EditSnapImgPage } from '../edit-snap-img/edit-snap-img.page';


@Component({
  selector: 'app-snap',
  templateUrl: './snap.page.html',
  styleUrls: ['./snap.page.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class SnapPage implements OnInit {


  post = {
    content:''
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
    private gestureCtrl: GestureController,
    private cameraPreview: CameraPreview,
    private videoPlayer: VideoPlayer,
    private media: Media,
    private router: Router,
    private fileOpener: FileOpener,
    private fPath: FilePath,
    private webview: WebView,
    private streamingMedia: StreamingMedia,
    private videoEditor: VideoEditor,
    private androidPermissions:AndroidPermissions,
    private modalController: ModalController,
    private menuCtrl: MenuController
  ) { 
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);

    this.captureI = document.getElementById("captureI");
    this.isFlash = 2;
    this.cameraPreview.setFlashMode(this.cameraPreview.FLASH_MODE.OFF);
  }

  ngOnInit() {
    this.initCamera()
  }



  initCamera(){
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
          console.log("OOOOOOOOOOOOOK", res);
          this.cameraActive = true;
        },
        (err) => {
          console.log(err);
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
    this.dismiss()
    this.cameraActive = false;
  }

  takePicture() {
    // picture options
    this.captureI = document.getElementById("captureI");
    console.log(this.captureI);
    this.captureI.setAttribute("color", "danger");
    const pictureOpts: CameraPreviewPictureOptions = {
      width: 1280,
      height: 1280,
      quality: 100,
    };

    // take a picture
    this.cameraPreview.takePicture(pictureOpts).then(
      (imageData) => {
        this.picture = "data:image/jpeg;base64," + imageData;
        this.captureI.setAttribute("color", "light");
        this.presentModalImg(imageData);
      },
      (err) => {
        console.log(err);
        // this.picture = "assets/img/test.jpg";
      }
    );
  }

  /**
   * Switch the camera
   */
  switchCamera() {
    this.cameraPreview.switchCamera();
  }
  /**
   * Remove the user interface when snap is taken
   */
  closeTookSnap() {}

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
          this.presentModal("file://" + filePath, pictures);
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
    };
    this.cameraPreview.startRecordVideo(opt);
    this.isRecording = true;
    this.startTimer();
  }

  /**
   * Send a picture
   */
  sendPicture() {}

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
      },
    });
    return await modal.present();
  }

  async presentModalImg(path) {
    const modal = await this.modalController.create({
      component: EditSnapImgPage,
      cssClass: "my-custom-class",
      componentProps: {
        filePath: path,
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
