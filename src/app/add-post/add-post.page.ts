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
    userPseudo:''
  }

 

  loading =  false
  user:any
  listPosts = []

  photos: any = [];
  filesName = new Array();
  dispImags = []

  constructor(public modalController: ModalController, 
    private toastController : ToastController,
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
    this.post.userId = localStorage.getItem('teepzyUserId');
    this.getUserInfo(this.post.userId)

  }

  

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
      console.log(res)
      this.user = res['data'];
    }, error =>{
      console.log(error)
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




  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Quel pseudo Voulez-vous utiliser ?',
      message: '',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.presentToast('Publication annulée')
          }
        }, 
        
        {
          text: 'Amical',
          cssClass: 'secondary',
          handler: (blah) => {
            this.post.userPseudo = this.user['pseudoIntime']
            console.log(this.post.userPseudo);
            this.addPost()
          }
        },{
          text: 'Professionnel',
          handler: () => {
            this.post.userPseudo = this.user['pseudoPro']
            console.log(this.post.userPseudo);
            this.addPost()

          }
        }
      ]
    });

    await alert.present();
  }


  getPosts(userId) {
    this.contactService.getPosts(userId).subscribe(res => {
      console.log(res)
      this.listPosts = res['data']
      this.dataPass.sendPosts(this.listPosts);  
    }, error =>{
      console.log(error)
    })
  }

  addPost(){
    this.loading =  true
    this.post.userPhoto_url = this.user.photo
    console.log(this.post);

    this.contactService.addPost(this.post).subscribe(res =>{
      console.log(res);
      this.loading =  false
      if (res['status'] == 200) {
        this.getPosts(this.post.userId)
        this.presentToast('Demande publiée')
        this.dismiss()
      }
    }, error =>{
      console.log(error)
      this.loading =  false
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
