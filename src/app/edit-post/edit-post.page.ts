import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AlertController, ToastController, MenuController, ModalController, NavParams, ActionSheetController } from '@ionic/angular';
import { AuthService } from '../providers/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactService } from '../providers/contact.service';
import { Subscription } from 'rxjs';
import { base_url } from 'src/config';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { DatapasseService } from '../providers/datapasse.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.page.html',
  styleUrls: ['./edit-post.page.scss'],
})
export class EditPostPage implements OnInit {

  userId = ''
  poste:any


  post = {
    postId:'',
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

  constructor(
    private authService: AuthService,
    private toasterController: ToastController,
    public alertController: AlertController,
    private menuCtrl: MenuController,
    public route: ActivatedRoute,
    private contactService: ContactService,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private camera: Camera,
    private filePath: FilePath,
    public actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
    private mediaCapture: MediaCapture,
    private dataPasse: DatapasseService

  ) { 
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);

  }

  ngOnInit() {
    this.userId = localStorage.getItem('teepzyUserId');
    this.getUserInfo(this.userId)
   // let idTeepz = this.route.snapshot.paramMap.get('idTeepz')
    let post = this.navParams.data;
    console.log(post['_id'])
    this.getAPost(post['_id'])
    this.getRepost(post['_id'])
  }


  
  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
      console.log(res)
      this.user = res['data'];
    }, error => {
      console.log(error)
    })
  }


  getAPost(idTeepz) {
    this.contactService.getPost(idTeepz).subscribe(res => {
      console.log(res)
      this.poste = res['data'];
      this.post.content = this.poste.content
      this.post.backgroundColor = this.poste.backgroundColor
      this.post.image_url = this.poste.image_url
      this.post.userId = this.poste.userId
      this.post.postId = this.poste._id
      this.post.userPhoto_url = this.poste.userPhoto_url
      this.post.userPseudo = this.poste.userPseudo
      this.post.video_url = this.poste.video_url
      this.dataPasse.send(this.poste)
    }, error => {
      console.log(error)
    })

  }

  getRepost(idTeepz) {
    this.contactService.getRePost(idTeepz).subscribe(res => {
      console.log(res)
      if (this.poste == null) {
        this.poste = res['data']
        this.post.content = this.poste.content
        this.post.backgroundColor = this.poste.backgroundColor
        this.post.image_url = this.poste.image_url
        this.post.userId = this.poste.userId
        this.post.postId = this.poste._id
        this.post.userPhoto_url = this.poste.userPhoto_url
        this.post.userPseudo = this.poste.userPseudo
        this.post.video_url = this.poste.video_url
      }

    }, error => {
      console.log(error)
    })
  }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: "Confirmer modification ?",
      message: '',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.presentToast('Annulé')
          }
        },

        {
          text: 'Oui',
          handler: () => {
            this.update()
          }
        },

      ]
    });
    await alert.present();

  }

  getMyPosts(userId) {
    this.contactService.teepZ(userId).subscribe(res => {
      console.log(res)
      let listTeepz = res['data'];
      this.dataPasse.sendPosts(listTeepz)
    }, error => {
      console.log(error)
    })
  }

  getMyFavoritePosts(userId) {
    this.contactService.favorites(userId).subscribe(res => {
      console.log(res)
      let listFavorites = res['data'];
      this.dataPasse.sendFavorite(listFavorites)
    }, error => {
      console.log(error)
    })
  }


  update(){
    this.post.postId ? this.editPost() : this.editRePost()
  }

  editPost() {
    this.loading = true
    let post = {
      postId: this.post.postId,
      content: this.post.content,
      image_url: this.post.image_url,
      video_url: this.post.video_url,
      backgroundColor: this.post.backgroundColor,
    }
    this.contactService.updatePost(post).subscribe(res => {
      console.log(res)
      this.loading = false
      this.presentToast('Post modifié')
      this.getAPost(this.post.postId)
      this.getMyFavoritePosts(this.userId)
      this.getMyPosts(this.userId)
      this.dismiss()

    }, error => {
      console.log(error)
      this.loading = false

    })
  }


  editRePost() {
    this.loading = true
    let post = {
      postId: this.post.postId,
      content: this.post.content,
      image_url: this.post.image_url,
      video_url: this.post.video_url,
      backgroundColor: this.post.backgroundColor,
    }
    this.contactService.updateRePost(post).subscribe(res => {
      console.log(res)
      this.loading = false
      this.presentToast('Post modifié')
      this.getMyFavoritePosts(this.userId)
      this.getMyPosts(this.userId)
      this.dismiss()
    }, error => {
      console.log(error)
      this.loading = false
      this.presentToast('Oops! une erreur est survenue')

    })
  }



  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Selectionner un média",
      buttons: [{
        text: 'Choisir dans votre galerie',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Utiliser la Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Choisir une vidéo',
        handler: () => {
          this.pickVideo(this.camera.PictureSourceType.PHOTOLIBRARY);
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
        if (this.photos.length == 0) {
          this.photos.push(nativepath)
        } else if (this.photos.length > 1) {
          this.presentToast('Vous ne pouvez pas sélectionner pluisieurs images')
        }
      }, error => {
      })

    }, (err) => {
      // Handle error

    });
  }


  takeVideo() {
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
          if (this.videos.length == 0) {
            this.videos.push(nativepath)
          } else if (this.videos.length > 1) {
            this.presentToast('Vous ne pouvez pas sélectionner pluisieurs videos')
          }
        }, error => {
        })
   
 
      

    }, (err) => {
      // Handle error

    });
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
          this.update()
          this.loading = false
        }, error => {
          this.loading = false

        })
      }
    } else if (ref.videos.length > 0 && ref.photos.length == 0) {
      if (this.videoPlayers.nativeElement.duration < 16.5) {
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
            this.update()
            this.loading = false
  
          }, error => {
            this.loading = false
           // alert("video upload did not work!" + JSON.stringify(error))
  
          })
        }
      }else{
        this.presentToast("La durée de la vidéo ne doit pas dépasser 15s")
        this.loading = false

      }
    
    }
    else {
      this.update()
      this.loading = false

    }

  }


  setBackgroundColor(color: string) {
    console.log(color)
    this.post.backgroundColor = color;
    this.presentToast('couleur sélectionnée')
  }

  
  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }


  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
