import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController, ToastController, AlertController, ActionSheetController, MenuController } from '@ionic/angular';
import { ContactService } from '../providers/contact.service';
import { AuthService } from '../providers/auth.service';
import { DatapasseService } from '../providers/datapasse.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { base_url } from 'src/config';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { MESSAGES } from '../constant/constant';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Router } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { UploadService } from '../providers/upload.service';


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
  createdPost

  myImage = ""
  croppedImage = null
  @ViewChild(ImageCropperComponent, {static: false}) angularCropper: ImageCropperComponent;

  imageBase64 = {
    imageName : "",
    base64image:''

  }

  items: string[] = ["Noah", "Liam", "Mason", "Jacob" ]

  userId = ''
  members = []
  constructor(public modalController: ModalController,
    private toastController: ToastController,
    private authService: AuthService,
    private contactService: ContactService,
    private dataPass: DatapasseService,
    public alertController: AlertController,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
    public sanitizer: DomSanitizer,
    private menuCtrl: MenuController,
    private mediaCapture: MediaCapture,
    private uploadService: UploadService,
    private router: Router,
    private file: File,
    private webView: WebView,
    private DomSanitizer: DomSanitizer

  ) {

    //this.menuCtrl.enable(false);
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);


  }

  ngOnInit() {


  }

  ionViewWillEnter() {
    this.userId = localStorage.getItem('teepzyUserId');
    this.post.userId = localStorage.getItem('teepzyUserId');
    this.getUserInfo(this.post.userId)
    this.getUsersOfCircle()
    //this.socket.emit('online', this.post.userId);

  }


removeMedia(){
  this.dispVideos = []
  this.dispImags = []
}

getUsersOfCircle() {
 this.subscription = this.contactService.getCircleMembers(this.userId).subscribe(res => {
    //console.log(res);
    this.members = res['data']
    console.log(this.members);
  }, error => {
    // console.log(error)

  })
}


  getUserInfo(userId) {
   this.subscription = this.authService.myInfos(userId).subscribe(res => {
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
     /* {
        text: 'Choisir une vidéo',
        icon: "grid",
        handler: () => {
          this.chooseVideo();
        }
      },*/
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
        //this.myImage = 'data:image/jpeg;base64,' + imageData;
        this.dispImags.push(this.webView.convertFileSrc(imageData))
        if (imageData) {
        this.imageData = imageData;
        } 
      }, (err) => {
        // Handle error
       // alert(JSON.stringify(err))

      });
    } else {
      this.presentToast("Vous n'avez pas autorisé l'accès à la prise de photo")
    }

  }


  takeImage(sourceType) {
      const options: CameraOptions = {
        quality: 40,
        sourceType: sourceType,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }
      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        this.dispImags.push(this.webView.convertFileSrc(imageData))
        if (imageData) {
        this.imageData = imageData;
        } 
      }, (err) => {
        // Handle error

      });

  }

  takeVideo() {
      let options: CaptureVideoOptions = { limit: 1, duration: 15 }
      this.mediaCapture.captureVideo(options)
        .then(
          (data: MediaFile[]) => {
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

  }


  upLoadImage() {
    this.uploadService.uploadImage(this.imageData).then(res => {
      this.post.image_url = res;
      this.addPost()
    }, err => {
      this.presentToast("Oops une erreur lors de l'upload")
      //this.dismiss();
    });
  }


  uploadImage() {
      var ref = this;
      this.loading = true
      if (ref.dispImags.length > 0 && ref.videos.length == 0) {
        this.upLoadImage()
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

  }



 /* chooseVideo() {
    if (this.user.isPhotoAuthorized === true) {
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
    }else {
      this.presentToast("Vous n'avez pas autorisé l'accès à la prise de photo")
    }
  }
*/

  confirmBeforePosting() {
    this.showModal = true
    console.log(this.showModal)
  }


  addPost() {
    this.loading = true
    this.post.userPhoto_url = this.user.photo
    this.post.userPseudo = this.user.pseudoIntime
   this.subscription = this.contactService.addPost(this.post).subscribe(res => {
      if (res['status'] == 200) {
        this.createdPost = res['data']
       this.dataPass.sendPosts(this.createdPost);
        this.router.navigate(['/tabs/tab1'])
        this.loading = false
      }
    }, error => {
      this.loading = false
      this.presentToast(MESSAGES.ADD_FEED_ERROR)
      

    })
  }



  // Data url file select
  picImage(sourceType) {
    if (this.user.isPhotoAuthorized === true) {
      const options: CameraOptions = {
        quality: 100,
        sourceType: sourceType,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }
      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
         this.myImage = 'data:image/jpeg;base64,' + imageData;
         this.dispImags.push(this.webView.convertFileSrc(imageData))
         if (imageData) {
         this.imageData = imageData;
         }       

      }, (err) => {
        // Handle error

      });
    } else {
      this.presentToast("Vous n'avez pas autorisé l'accès à la prise de photo")
    }

  }


  imageCropped(event: ImageCroppedEvent){
    this.croppedImage = event.base64
    this.imageBase64.base64image = this.croppedImage
    this.imageBase64.imageName =  (Math.random() * 100000000000000000) + '0'
  }

  imageLoaded(){}

  uploadCroppedImage(){
    if (this.imageBase64.base64image) {
     this.subscription = this.contactService.uploadBase64(this.imageBase64).subscribe(res =>{
        console.log(res)
        var serverUrl = base_url + 'upload-avatar-base64'
        this.post.image_url = serverUrl + this.imageBase64.imageName
        this.addPost()
      }, error =>{
        console.log(error)
      })
    } else{
      this.addPost()
    }
  }

  clear(){
    this.angularCropper.imageBase64 = null
    this.myImage = null;
    this.croppedImage = null
    this.dispImags = []
    this.imageData = ""
  }
  save(){
    this.angularCropper.crop()
  }

  rotateLeft(){ }
  rotateRight(){}
  flipVertical(){}
  move(x,y){
    this.angularCropper.cropper.x1 += x 
    this.angularCropper.cropper.x2 += x 
    this.angularCropper.cropper.y1 += y 
    this.angularCropper.cropper.y2 += y 

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
}

}
