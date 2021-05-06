import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, MenuController, ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { base_url } from 'src/config';
import { ContactService } from '../providers/contact.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { MESSAGES } from '../constant/constant';

@Component({
  selector: 'app-signup-final',
  templateUrl: './signup-final.page.html',
  styleUrls: ['./signup-final.page.scss'],
})
export class SignupFinalPage implements OnInit {
  user = {
    pseudoIntime: '',
    userId: '',
    role: '',
    photo: '',
    birthday: '',
    gender: ''

  }

  userInfo: any

  photos: any = [];
  filesName = new Array();
  dispImags = []


  retourUsr: any
  retourUsrP = 0
  profileInfo: any
  captchaR: any
  loading = false;

  loadingA = false
  loadingP = false



  constructor(private authService: AuthService,
    public router: Router,
    public toastController: ToastController,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    private camera: Camera,
    private filePath: FilePath,
    public actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
    private contactService: ContactService,
  ) {


  }

  ngOnInit() {
    let usr = this.route.snapshot.queryParamMap
    this.user.photo = usr['params']['photo']
    this.user.userId = localStorage.getItem('teepzyUserId')
    this.getUserInfo(this.user.userId)
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
  }



  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
      //  console.log(res)
      this.userInfo = res['data'];
      this.userInfo['photo'] ? this.dispImags[0] = this.userInfo['photo'] : null
    }, error => {
      //  console.log(error)
    })
  }

  updateUser() {
    if ((this.user.pseudoIntime != '')) {
      this.user.pseudoIntime = this.user.pseudoIntime.toLowerCase()
      this.authService.update(this.user).subscribe(res => {
        //  console.log(res)
        if (res['status'] == 200) {
          this.retourUsr = true
          this.presentToast(MESSAGES.LOGIN_OK)
          localStorage.setItem('FinalStepCompleted', 'FinalStepCompleted')
          let user = {
            userId: this.user.userId,
            isOnline: true
          }
          this.contactService.getConnected(user).subscribe(res => {
            //   console.log(res)
          })
          this.router.navigateByUrl('/tuto-video', {
            replaceUrl: true
          })
        }
      }, error => {
        // console.log(error)
        this.presentToast(MESSAGES.SERVER_ERROR)
      })
    }
    else {
      this.presentToast('Veuillez renseigner un pseudo')
    }
  }

  updateDOBDateDeNaissance(dateObject) {
    // convert object to string then trim it to dd-mm-yyyy
    var offsetMs = dateObject.value.getTimezoneOffset() * 60000;
    let dte = new Date(dateObject.value.getTime() - offsetMs);
    this.user.birthday = dte.toISOString()
    //console.log(this.user.birthday)

  }





  check() {
    this.loadingA = true
    this.user.pseudoIntime = this.user.pseudoIntime.toLowerCase().replace(/\s/g, '')
    //console.log(this.user.pseudoIntime)
    this.authService.check(this.user).subscribe(res => {
      //console.log(res)
      this.loadingA = false

      if (res['status'] == 201) {
        this.retourUsr = 201
      } else if (res['status'] == 404) {
        this.retourUsr = 404
      }
    }, error => {
      // console.log(error)
      this.loadingA = false

      this.presentToast('Oops! une erreur est survenue')

    })
  }

  checkP() {
    this.loadingP = true
    this.authService.check(this.user).subscribe(res => {
      // console.log(res)
      this.loadingP = false
      if (res['status'] == 201) {
        this.retourUsrP = 201
      } else if (res['status'] == 404) {
        this.retourUsrP = 404
      }
    }, error => {
      // console.log(error)
      this.loadingP = false
      this.presentToast(MESSAGES.SERVER_ERROR)

    })
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
      this.dispImags[0] = (<any>window).Ionic.WebView.convertFileSrc(imageData)
      this.filePath.resolveNativePath(imageData).then((nativepath) => {
        this.photos[0] = nativepath
      })
    }, (err) => {
      // Handle error
    });

  }


  uploadImage() {
    this.presentLoading()
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
          this.user.photo = base_url + options.fileName;
          this.loading = false;
          this.updateUser()
        }, error => {
        })
      }
    } else {
      this.loading = false;
      this.updateUser()
    }


  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

  async presentLoading() {
    this.loading = true;
    return await this.loadingCtrl.create({
      duration: 5000,
    }).then(a => {
      a.present().then(() => {
        // console.log('presented');
        if (!this.loading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismissLoading() {
    this.loading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }

}
