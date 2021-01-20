import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController, ToastController, AlertController, ActionSheetController, MenuController } from '@ionic/angular';
import { ContactService } from '../providers/contact.service';
import { AuthService } from '../providers/auth.service';
import { DatapasseService } from '../providers/datapasse.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { base_url } from 'src/config';
//import { Socket } from 'ngx-socket-io';
import { Subscription, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { typeAccount, MESSAGES } from '../constant/constant';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Router } from '@angular/router';
import { File } from '@ionic-native/file/ngx';


@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
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
  imageData
  @ViewChild('myVideo', null) videoPlayers: ElementRef;

  currentPlaying = null




  constructor(public modalController: ModalController,
    private toastController: ToastController,
    private authService: AuthService,
    private contactService: ContactService,
    private dataPass: DatapasseService,
    public alertController: AlertController,
    private camera: Camera,
    private filePath: FilePath,
    public actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
    //private socket: Socket,
    public sanitizer: DomSanitizer,
    private menuCtrl: MenuController,
    private mediaCapture: MediaCapture,
    private androidPermissions: AndroidPermissions,
    private fileChooser: FileChooser,
    private webview: WebView,
    private router: Router,
    private file: File

  ) {

    this.menuCtrl.enable(false);

  }

  ngOnInit() {


  }

  ionViewWillEnter() {
    this.post.userId = localStorage.getItem('teepzyUserId');
    this.getUserInfo(this.post.userId)
    //this.socket.emit('online', this.post.userId);

  }


removeMedia(){
  this.dispVideos = []
  this.dispImags = []
}
  requestNecessaryPermissions() {
    // Change this array to conform with the permissions you need
    const androidPermissionsList = [
      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
      this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
      this.androidPermissions.PERMISSION.READ_PHONE_STATE,
      this.androidPermissions.PERMISSION.WRITE_PHONE_STATE,
    ];
    return this.androidPermissions.requestPermissions(androidPermissionsList);
  }


  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
      console.log(res)
      this.user = res['data'];
      this.user['photo'] ? this.userPhoto[0] = this.user['photo'] : null
    }, error => {
      console.log(error)
    })
  }

  dismissConfirmModal() {
    if (this.showModal) {
      this.showModal = false
    } else {
      this.showModal = true
    }

  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Selectionner un média",
      buttons: [{
        text: 'Choisir une image',
        icon: "images",
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
     /* {
        text: 'Utiliser la Camera',
        icon: "camera",
        handler: () => {
          this.takeImage(this.camera.PictureSourceType.CAMERA);
        }
      },*/
      {
        text: 'Choisir une vidéo',
        icon: "grid",
        handler: () => {
          this.chooseVideo();
        }
      },
      /*{
        text: 'Enregistrer une vidéo',
        icon: "videocam",
        handler: () => {
          this.takeVideo();
        }
      },*/
      {
        text: 'Annuler',
        icon: "close",
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }




  pickImage(sourceType) {
    if (this.user.isPhotoAuthorized === true) {
    this.requestNecessaryPermissions().then(() => {
      const options: CameraOptions = {
        quality: 100,
        sourceType: sourceType,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }
      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        // let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.dispImags.push((<any>window).Ionic.WebView.convertFileSrc(imageData))
        this.filePath.resolveNativePath(imageData).then((nativepath) => {
          if (this.photos.length == 0) {
            this.photos.push(nativepath)
          } else if (this.photos.length > 1) {
            this.presentToast(MESSAGES.MEDIA_LIMIT_ERROR)
          }
        }, error => {
          alert(JSON.stringify(error))
        })

      }, (err) => {
        // Handle error

      });
    })
    } else {
      this.presentToast("Vous n'avez pas autorisé l'accès à la prise de photo")
    }

  }


  takeImage(sourceType) {
    this.requestNecessaryPermissions().then(() => {
      const options: CameraOptions = {
        quality: 100,
        sourceType: sourceType,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }
      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        this.imageData = imageData;
        this.dispImags.push((<any>window).Ionic.WebView.convertFileSrc(imageData))
        this.filePath.resolveNativePath(imageData).then((nativepath) => {
          if (this.photos.length == 0) {
            this.photos.push(nativepath)
          } else if (this.photos.length > 1) {
            this.presentToast(MESSAGES.MEDIA_LIMIT_ERROR)
          }
        }, error => {
         // alert(JSON.stringify(error))
        })
      }, (err) => {
        // Handle error

      });
    })

  }

/*
  play(myFile){
    let video = this.videoPlayers.nativeElement
    video.src = myFile.localURL
  }
*/

  takeVideo() {

    this.requestNecessaryPermissions().then(() => {
      let options: CaptureVideoOptions = { limit: 1, duration: 15 }
      this.mediaCapture.captureVideo(options)
        .then(
          (data: MediaFile[]) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64 (DATA_URL):
            // let base64Image = 'data:image/jpeg;base64,' + imageData;
            //this.dispVideos.push(data[0].fullPath)
            // videoPath = data[0].localURL
           /* let videoPath = data[0].fullPath
            this.dispVideos[0] = this.sanitizer.bypassSecurityTrustUrl(data[0]['localURL']);
            if (this.videos.length == 0) {
              this.videos.push(videoPath)
            } else if (this.videos.length > 1) {
              this.presentToast('Vous ne pouvez pas sélectionner pluisieurs videos')
            }*/

            let captureFile = data[0]
            let fileName = captureFile.name
            let dir = captureFile['localURL']
            dir.pop()
            let fromDirectory = dir.join('/');
            let toDirectory = this.file.dataDirectory;
            this.file.copyFile(fromDirectory,fileName,toDirectory,fileName).then(res =>{
              
            })
          },
          (err: CaptureError) => {
            console.error(err)
            alert(JSON.stringify(err))

          }
        );
    })

  }



  uploadImage() {
    this.requestNecessaryPermissions().then(() => {
      var ref = this;
      this.loading = true
      if (ref.photos.length > 0 && ref.videos.length == 0) {
        for (let index = 0; index < ref.photos.length; index++) {
          // interval++
          const fileTransfer = ref.transfer.create()
          let options: FileUploadOptions = {
            fileKey: "avatar",
            fileName: (Math.random() * 100000000000000000) + '.jpg',
            chunkedMode: false,
            mimeType: "image/jpeg",
            headers: {},
          }
          var serverUrl = base_url + 'upload-avatar'
          this.filesName.push({ fileUrl: base_url + options.fileName, type: 'image' })
          fileTransfer.upload(ref.photos[index], serverUrl, options).then(() => {
            this.post.image_url = base_url + options.fileName;
            this.addPost()
            this.loading = false
          }, error => {
            this.loading = false
          })
        }
      } else if (ref.videos.length > 0 && ref.photos.length == 0) {
        if (this.videoPlayers.nativeElement.duration < 35) {
       //   alert("upload started")
          for (let index = 0; index < ref.videos.length; index++) {
            // interval++
            const fileTransfer = ref.transfer.create()
            let options: FileUploadOptions = {
              fileKey: "avatar",
              fileName: (Math.random() * 100000000000000000) + '.mp4',
              chunkedMode: false,
              mimeType: "video/mp4",
              headers: {},
            }
            var serverUrl = base_url + 'upload-avatar'
            this.filesName.push({ fileUrl: base_url + options.fileName, type: 'video' })
            fileTransfer.upload(ref.videos[index], serverUrl, options).then(() => {
              this.post.video_url = base_url + options.fileName;
          //    alert("upload finished")
              this.addPost()
              this.loading = false

            }, error => {
              this.loading = false
            //  alert(JSON.stringify(error))

         //    alert("video upload did not work!" + JSON.stringify(error))

            })
          }
        } else {
          this.presentToast(MESSAGES.VIDEO_LIMIT_ERROR)
          this.loading = false
        }
      }
      else {
        this.addPost()
        this.loading = false

      }
    })

  }



  chooseVideo() {
    if (this.user.isPhotoAuthorized === true) {
      this.requestNecessaryPermissions().then(() => {
        this.fileChooser
          .open({ mime: "video/mp4" })
          .then((uri) => {
            //alert(uri)
            //const pictures = "data:image/jpeg;base64," + uri;
            //this.presentModal(uri, pictures);
            this.dispVideos.push(this.webview.convertFileSrc(uri))
  
            this.videos.push(uri)
          })
          .catch((e) => console.log(e));
      })
    }else {
      this.presentToast("Vous n'avez pas autorisé l'accès à la prise de photo")
    }
  }


  confirmBeforePosting() {
    this.showModal = true
    console.log(this.showModal)
  }

  getPosts(userId) {
    this.contactService.getPosts(userId).subscribe(res => {
      console.log(res)
      this.listPosts = res['data']
      this.dataPass.sendPosts(this.listPosts);
    }, error => {
      console.log(error)
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
        this.router.navigate(['/tabs/tab1'])
      }
    }, error => {
      // console.log(error)
      this.loading = false
      this.presentToast(MESSAGES.ADD_FEED_ERROR)

    })
  }


  setBackgroundColor(color: string) {
    console.log(color)
    this.post.backgroundColor = color;
    this.presentToast('couleur sélectionnée')
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
    //this.socket.removeAllListeners('message');
    //this.socket.removeAllListeners('users-changed');
  }

}
