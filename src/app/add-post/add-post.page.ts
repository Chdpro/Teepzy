import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  ModalController, ToastController, AlertController,
  ActionSheetController, MenuController, Platform
} from '@ionic/angular';
import { ContactService } from '../providers/contact.service';
import { AuthService } from '../providers/auth.service';
import { DatapasseService } from '../providers/datapasse.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { base_url } from 'src/config';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { MESSAGES } from '../constant/constant';

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
    private socket: Socket,
    public sanitizer: DomSanitizer,
    private menuCtrl: MenuController,
    private mediaCapture: MediaCapture,
    private androidPermissions: AndroidPermissions
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



  pickImagePermission(sourceType) {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      result => {
        if (result.hasPermission) {
          // code
          this.pickImage(sourceType)
        } else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(result => {
            if (result.hasPermission) {
              // code
              this.pickImage(sourceType)
            }
          });
        }
      },
      err => {
        alert(err)
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      }
    );
  }

  takeImagePermission(sourceType) {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => {
        if (result.hasPermission) {
          // code
          this.pickImage(sourceType)
        } else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(result => {
            if (result.hasPermission) {
              // code
              this.pickImage(sourceType)
            }
          });
        }
      },
      err => {
        alert(err)
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      }
    );
  }

  pickVideoPermission(sourceType) {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      result => {
        if (result.hasPermission) {
          // code
          this.pickVideo(sourceType)
        } else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(result => {
            if (result.hasPermission) {
              // code
              this.pickVideo(sourceType)
            }
          });
        }
      },
      err => {
        alert(err)
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      }
    );
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Selectionner un média",
      buttons: [{
        text: 'Choisir dans votre galerie',
        handler: () => {
          this.pickImagePermission(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Utiliser la Camera',
        handler: () => {
          this.takeImagePermission(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Choisir une vidéo',
        handler: () => {
          this.pickVideoPermission(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Enregistrer une vidéo',
        handler: () => {
          this.takeVideo();
        }
      },

      {
        text: 'Annuler',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }




  takeVideo() {

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => {
        if (result.hasPermission) {
          // code
            this.recordVideo()
        } else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(result => {
            if (result.hasPermission) {
              // code
              this.recordVideo()
            }
          });
        }
      },
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
    );

  }

  storeMediaFiles(files) {
    let mediafiles = []
    mediafiles = mediafiles.concat(files)
    alert(mediafiles[0].localURL)
    this.dispVideos.push(mediafiles[0].localURL)
    this.dispVideos.push((<any>window).Ionic.WebView.convertFileSrc(mediafiles[0].localURL))
    this.filePath.resolveNativePath(mediafiles[0].localURL).then((nativepath) => {
      alert(nativepath)
      if (this.videos.length == 0 && this.photos.length == 0) {
        this.videos.push(nativepath)
      } else if (this.videos.length > 1 && this.photos.length > 0) {
        this.presentToast(MESSAGES.MEDIA_LIMIT_ERROR)
      }
    }, error => {
    })
  }



  recordVideo() {
    
    let options: CaptureVideoOptions = { limit: 1, duration: 15 }
    this.mediaCapture.captureVideo(options)
      .then(
        (data: MediaFile[]) => {
          // imageData is either a base64 encoded string or a file URI
          // If it's base64 (DATA_URL):
          // let base64Image = 'data:image/jpeg;base64,' + imageData;
          this.dispVideos.push((<any>window).Ionic.WebView.convertFileSrc(data))
          let videoPath = 'file://' + data
          this.filePath.resolveNativePath(videoPath).then((nativepath) => {
            if (this.videos.length == 0) {
              this.videos.push(nativepath)
            } else if (this.videos.length > 1) {
              this.presentToast('Vous ne pouvez pas sélectionner pluisieurs videos')
            }
          }, error => {
          })
        },
        (err: CaptureError) => {
          console.error(err)
        }
      );


  /*
  let options: CaptureVideoOptions = { limit: 1, duration: 15 }
  this.mediaCapture.captureVideo(options)
    .then(
      (data: MediaFile[]) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        // let base64Image = 'data:image/jpeg;base64,' + imageData;
        let videoPath = data[0].fullPath
        let capturedFile = data[0]
        let fileName = capturedFile.name;
        let dir = capturedFile['localURL'].split('/');
        dir.pop();
        let fromDirectory = dir.join('/');
        let toDirectory = this.file.dataDirectory;

        alert('starting copy...')
        if (this.videos.length == 0) {
          this.file.copyFile(fromDirectory, fileName, toDirectory, fileName).then(res => {
            // let url = res.nativeURL.replace(/^file:\/\//, '')
            // this.dispVideos.push(url)
            let path = this.file.dataDirectory + fileName
            let url = path.replace(/^file:\/\//, '')
            this.dispVideos.push(url)
            this.videos.push(videoPath)
            alert(JSON.stringify(this.dispVideos))
          })
        } else if (this.videos.length > 1) {
          this.presentToast(MESSAGES.MEDIA_LIMIT_ERROR)
        }
      },
      (err: CaptureError) => {
        console.error(err)
      }
    );*/
}


  pickVideo(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.VIDEO,

    }

    this.camera.getPicture(options).then((videoData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;


      this.dispVideos.push((<any>window).Ionic.WebView.convertFileSrc(videoData))
      let videoPath = 'file://' + videoData
      this.filePath.resolveNativePath(videoPath).then((nativepath) => {
        if (this.videos.length == 0 && this.photos.length == 0) {
          this.videos.push(nativepath)
        } else if (this.videos.length > 1 && this.photos.length > 0) {
          this.presentToast(MESSAGES.MEDIA_LIMIT_ERROR)
        }
      }, error => {
      })




    }, (err) => {
      // Handle error

    });
  }






  pickImage(sourceType) {
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
      this.userPhoto[0] == this.dispImags[0]
      this.filePath.resolveNativePath(imageData).then((nativepath) => {
        if (this.photos.length == 0 && this.videos.length == 0) {
          this.photos.push(nativepath)
        } else if (this.photos.length > 1 && this.videos.length > 0) {
          this.presentToast(MESSAGES.MEDIA_LIMIT_ERROR)
        }
      }, error => {
      })

    }, (err) => {
      // Handle error

    });
  }


  addPostUsingPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      result => {
        if (result.hasPermission) {
          // code
          this.uploadImage()
        } else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(result => {
            if (result.hasPermission) {
              // code
              this.uploadImage()
            }
          });
        }
      },
      err => {
        alert(err)
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      }
    );
  }
  
  uploadImage() {
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
          alert(JSON.stringify(error))
        })
      }
    } else if (ref.videos.length > 0 && ref.photos.length == 0) {
      //alert(this.videoPlayers.nativeElement.duration)
      if (this.videoPlayers.nativeElement.duration < 16.5
        && isNaN(this.videoPlayers.nativeElement.duration) !== true) {
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
            this.addPost()
            this.loading = false

          }, error => {
            this.loading = false
            alert("video upload did not work!" + JSON.stringify(error))

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
