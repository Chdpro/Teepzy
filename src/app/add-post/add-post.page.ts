import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import { ContactService } from '../providers/contact.service';
import { AuthService } from '../providers/auth.service';
import { DatapasseService } from '../providers/datapasse.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { base_url } from 'src/config';

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
  ) { }

  ngOnInit() {


  }

  ionViewWillEnter() {
    this.post.userId = localStorage.getItem('teepzyUserId');
    this.getUserInfo(this.post.userId)
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
      header: "Select Image source",
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
        this.photos.push(nativepath)
      }, error => {
      })

    }, (err) => {
      // Handle error
      alert(err)

    });
  }


  uploadImage(p) {
    var ref = this;
    this.loading = true
    if (ref.photos.length > 0) {
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
          this.addPost(p)
          this.loading = false

        }, error => {
          this.loading = false

        })
      }
    }
   else {
      this.addPost(p)
      this.loading = false

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

  addPost(p) {
    this.loading = true
    this.post.userPhoto_url = this.user.photo
    this.post.userPseudo = p
    console.log(this.post);
    //this.photos.length > 0 ? this.uploadImage() : null
    this.contactService.addPost(this.post).subscribe(res => {
      console.log(res);
      this.loading = false
      if (res['status'] == 200) {
        this.getPosts(this.post.userId)
        this.presentToast('Demande publiée')
        this.dismiss()
      }
    }, error => {
      console.log(error)
      this.loading = false
      this.presentToast('Oops! une erreur est survenue')

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


}
