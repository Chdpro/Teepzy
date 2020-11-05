import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import {
  ModalController, ToastController, AlertController,
  ActionSheetController, MenuController
} from '@ionic/angular';
import { ContactService } from '../providers/contact.service';
import { AuthService } from '../providers/auth.service';
import { DatapasseService } from '../providers/datapasse.service';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { MESSAGES } from '../constant/constant';
import { Router } from '@angular/router';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { EditSnapPage } from '../edit-snap/edit-snap.page';
import { CameraPreview, CameraPreviewPictureOptions } from '@ionic-native/camera-preview/ngx';
import { SnapPage } from '../snap/snap.page';
import { UploadService } from '../providers/upload.service';
import { EditSnapImgPage } from '../edit-snap-img/edit-snap-img.page';

const MEDIA_FILES_KEY = 'mediaFiles'


@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddPostPage implements OnInit {

  post = {
    userId: '',
    content: '',
    image_url: '',
    video_url: '',
    userPhoto_url: '',
    backgroundColor: '#fff',
    userPseudo: ''
  }

  loading = false
  showModal = false
  user: any
  listPosts = []
  photos: any = [];
  filesName = new Array();
  dispImags = []
  userPhoto = []
  videos: any = [];
  videoFilesName = new Array();
  dispVideos = []
  testVideos = ['../../assets/test.mp4']
  subscription: Subscription;
  @ViewChild('myVideo', null) videoPlayers: ElementRef;
  @ViewChild('myVideoCamera', null) myVideoCamera: ElementRef;
  mediaFiles = []
  currentPlaying = null


  @ViewChild("video", null) video: ElementRef;
  @ViewChild("c1", null) c1: ElementRef;
  @ViewChild("ctx1", null) ctx1: any;
  image = null;
  cameraActive = false;
  torchActive = false;
  isRecording = false;
  picture;
  poste: any;
  vid;
  width;
  height;

  constructor(public modalController: ModalController,
    private toastController: ToastController,
    private authService: AuthService,
    private contactService: ContactService,
    private dataPass: DatapasseService,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    private socket: Socket,
    public sanitizer: DomSanitizer,
    private menuCtrl: MenuController,
    private androidPermissions: AndroidPermissions,
    private fileChooser: FileChooser,
    public router: Router,

  ) {
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);

  }

  ngOnInit() {

  }

  


  
  ionViewWillEnter() {
    this.post.userId = localStorage.getItem('teepzyUserId');
    this.getUserInfo(this.post.userId)
    this.socket.emit('online', this.post.userId);

  }

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
      // console.log(res)
      this.user = res['data'];
      this.user['photo'] ? this.userPhoto[0] = this.user['photo'] : null
    }, error => {
      //  console.log(error)
    })
  }

  dismissConfirmModal() {
    if (this.showModal) {
      this.showModal = false
    } else {
      this.showModal = true
    }

  }


  storeMediaFiles(files) {
    this.mediaFiles = this.mediaFiles.concat(files)
  }


  addPostUsingPermission() {
    this.androidPermissions
    .checkPermission(this.androidPermissions
      .PERMISSION.READ_EXTERNAL_STORAGE).then(
      result => {
        if (result.hasPermission) {
          // code
          this.addPost()
        } else {
          this.androidPermissions
          .requestPermission(this.androidPermissions
            .PERMISSION.READ_EXTERNAL_STORAGE).then(result => {
            if (result.hasPermission) {
              // code
              this.addPost()
            }
          });
        }
      },
      err => {
        alert(err)
        this.androidPermissions.
        requestPermission(this.androidPermissions.
          PERMISSION.READ_EXTERNAL_STORAGE)
      }
    );
  }


  confirmBeforePosting() {
    this.showModal = true
    // console.log(this.showModal)
  }

  getPosts(userId) {
    this.contactService.getPosts(userId).subscribe(res => {
      // console.log(res)
      this.listPosts = res['data']
      this.dataPass.sendPosts(this.listPosts);
      this.dismiss()
      this.presentToast(MESSAGES.ADD_FEED_OK)

    }, error => {
      // console.log(error)
    })
  }

  addPost() {
    this.loading = true
    this.post.userPhoto_url = this.user.photo
    this.post.userPseudo = this.user.pseudoIntime
    //this.photos.length > 0 ? this.uploadImage() : null
    this.contactService.addPost(this.post).subscribe(res => {
      // console.log(res);
      if (res['status'] == 200) {
        this.getPosts(this.post.userId)
        this.loading = false

      }
    }, error => {
      // console.log(error)
      this.loading = false
      this.presentToast(MESSAGES.ADD_FEED_ERROR)

    })
  }

  setBackgroundColor(color: string) {
    //  console.log(color)
    this.post.backgroundColor = color;
    this.presentToast(MESSAGES.COLOR_CHOSED_OK)
  }


  async presentModalImg(path, imgData?:any) {
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

  async presentModal(path, pics?: any) {
    const modal = await this.modalController.create({
      component: EditSnapPage,
      cssClass: "my-custom-class",
      componentProps: {
        filePath: path,
        imgSrc: pics,

      },
    });
    return await modal.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Action",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Utiliser la caméra",
          icon: "videocam",
          handler: () => {
            this.dismiss()
            //this.presentSnapModal()
            this.router.navigate(["/snap"]);
          },
        },
        {
          text: "Choisir une vidéo depuis gallerie",
          icon: "grid",
          handler: () => {
            //{ mime: "video/mp4" }
            this.fileChooser
              .open({ mime: "video/mp4" })
              .then((uri) => {
                this.dismiss()
                const pictures = "data:image/jpeg;base64," + uri;
                this.presentModal(uri, pictures);
              })
              .catch((e) => console.log(e));
          },
        },
        {
          text: "Choisir une image depuis gallerie",
          icon: "images",
          handler: () => {
            //{ mime: "video/mp4" }
            this.fileChooser
              .open({ mime: "image/jpeg" })
              .then((uri) => {
                this.dismiss()
                const pictures = uri;
                this.presentModalImg(uri, pictures);
              })
              .catch((e) => console.log(e));
          },
        },
        {
          text: "Annuler",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    await actionSheet.present();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }


  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null
  }

}
