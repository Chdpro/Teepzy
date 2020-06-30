import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { Router } from '@angular/router';
import { ToastController, AlertController, Platform, LoadingController, ActionSheetController } from '@ionic/angular';
import { WindowService } from '../providers/window.service';
import * as firebase from 'firebase/app';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { base_url } from 'src/config';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  user = {
    email: '',
    phone:'',
    nom:'',
    prenom:'',
    photo:'',
    birthday:'',

    conf:'',
    password: '',
  }

  retourUsr: any
  typeProfile = ''
  captchaR:any
  loading = false;
  telephone = ''
  codes = []

  profile: any
  photos: any = [];
  filesName = new Array();
  dispImags = []


  showModal =  'hidden'

  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;


  isLoading = false
  selected = '+33';
  windowRef: any;
  captcha = false;

  verificationCode: string;

  profileInfo:any


  constructor(private authService: AuthService,
    public router: Router,
    public toastController: ToastController,
    private win: WindowService,
    private alertCtrl:AlertController,
    private loadingCtrl: LoadingController,
    private camera: Camera,
    private filePath: FilePath,
    public actionSheetController: ActionSheetController,
    private transfer: FileTransfer,

    ) { }

  ngOnInit() {
    this.windowRef = this.win.windowRef
    //console.log(this.win.windowRef)
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
    this.windowRef.recaptchaVerifier.render()
    this.listCountriesCodes()
  }


  listCountriesCodes() {
    this.authService.listCodes().subscribe(res => {
      this.codes = res
      console.log(this.codes)
    })
  }

  shwModal(){
    console.log(this.showModal)
    if (this.showModal === 'hidden') {
      this.showModal = 'visible'
    } else {
      this.showModal = 'hidden'
    }
  }
  
  updateDOBDateDeNaissance(dateObject) {
    // convert object to string then trim it to dd-mm-yyyy
    var offsetMs = dateObject.value.getTimezoneOffset() * 60000;
    let dte = new Date(dateObject.value.getTime() - offsetMs);
    this.user.birthday = dte.toISOString()
    console.log(this.user.birthday)

  }



  signIn() {  
    const appVerifier = this.windowRef.recaptchaVerifier;
    const phoneNumberString = this.selected + this.telephone;
     this.user.phone = this.selected + this.telephone;
     console.log(phoneNumberString)
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then(async result => {
        this.windowRef.confirmationResult = result;
        console.log(this.windowRef.confirmationResult)
        let alert = await this.alertCtrl.create({
          //  title: 'Enter the Confirmation code',
          inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation de Code' }],
          buttons: [
            {
              text: 'Annuler',
              handler: data => { console.log('Cancel clicked'); }
            },
            {
              text: 'Envoyer',
              handler: data => {
                this.verificationCode = data.confirmationCode
                this.verifyCode()
              }
            }
          ]
        });
        await alert.present();

      })
      .catch(error => console.log(error));


  }


  choseAvatr(url){
    console.log(url)
      this.user.photo = url;
      this.presentToast("Avatar choisi ")

  }

  verifyCode() {
    this.presentLoading()
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then(result => {
     
        this.signup()

      })
      .catch(error =>{
        console.log(error, "Incorrect code entered?"); 
        this.presentToast("Incorrect code ")
      } );

  }
  

  signup(){
    console.log(JSON.stringify(this.user));
    this.presentLoading()
    if (this.user.password == this.user.conf) {
        this.authService.signup(JSON.stringify(this.user)).subscribe(res => {
          console.log(res)
          this.retourUsr = res;
            this.profileInfo = res['data']
            this.dismissLoading()
          if (this.retourUsr['status'] == 200) {
            this.presentToast('1ere étape passée ! Vous êtes inscrit ')
            this.loading = false
            localStorage.setItem('teepzyUserId', this.profileInfo['userI']['_id'])
            localStorage.setItem('teepzyToken',this.profileInfo['token'])
            localStorage.setItem('teepzyEmail', this.profileInfo['userI']['email'])
            this.router.navigate(['/signup-final'],{
              replaceUrl: true,
              queryParams: this.user, 
            })
           // this.obj.user = result.user;
          }
        }, error => {
          console.log(error)
          this.loading = false;
           if (error['status'] == 403){
            this.presentToast('Ce compte existe déjà. Vérifier email ou vos pseudos')
            this.dismissLoading()
          } else {
            this.presentToast('Oops! une erreur est survenue sur le serveur')
            this.dismissLoading()

          }
  
        })

    } else {
      this.loading = false;
      this.presentToast('le mot de passe et la confirmation ne correspondent pas')
      this.dismissLoading()

    }


  }



  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
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

      this.filePath.resolveNativePath(imageData).then((nativepath) => {
        this.photos.push(nativepath)
        //  alert(this.photos)
        if (this.photos.length != 0) {
          this.uploadImage()

        }
      })

    }, (err) => {
      // Handle error
    });
  }


  uploadImage() {
    var ref = this;
    for (let index = 0; index < ref.photos.length; index++) {
      // interval++
      const fileTransfer = ref.transfer.create()
      let options: FileUploadOptions = {
        fileKey: "photo",
        fileName: (Math.random() * 100000000000000000) + '.jpg',
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {},
      }
      var serverUrl = base_url + '/upload-photos'
      this.filesName.push({ fileUrl: "https://teepzy.com/" + options.fileName, type: 'image' })
      fileTransfer.upload(ref.photos[index], serverUrl, options).then(() => {
        this.user.photo = "http://92.222.71.38:3000/" + options.fileName
        this.presentToast('Photo Mise à jour')
      })
    }

  }


  async presentLoading() {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      duration: 5000,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }
}


