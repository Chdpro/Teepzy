import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController, MenuController } from '@ionic/angular';
import { ContactService } from '../providers/contact.service';
import { ToastController } from '@ionic/angular';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { AuthService } from '../providers/auth.service';
import { DatapasseService } from '../providers/datapasse.service';
import { Subscription } from 'rxjs';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { base_url } from 'src/config';
import { FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.page.html',
  styleUrls: ['./add-project.page.scss'],
})
export class AddProjectPage implements OnInit {

  title = 'Projets'
  project = {
    userId: '',
    nom: '',
    photo: [],
    tags : [],
    description: '',
  }

  subscription: Subscription;  
  listProjects = []
  loading = false


  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags = [
   
  ];

  photos: any = [];
  filesName = new Array();
  dispImags = []
  constructor(private modalController: ModalController, 
    private toasterController: ToastController,
    private authService: AuthService,
    private dataPass: DatapasseService,
    private camera: Camera,
    private filePath: FilePath,
    public actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
    private menuCtrl: MenuController,
    private androidPermissions: AndroidPermissions,
    private contactService: ContactService) { 
      this.menuCtrl.close('first');
      this.menuCtrl.swipeGesture(false); 
     }

  ngOnInit() {
    let userId = localStorage.getItem('teepzyUserId')
    this.project.userId = userId

  }

  ionViewWillEnter(){

  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }


    
  maxLengthDescription(ev:Event){
    let desc = this.project.description
    this.project.description.length > 100 ? this.project.description =  desc.slice(0,99): null 
    console.log(this.project.description.slice(0, 99))
  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }


  remove(tag): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
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
        if (this.photos.length < 4) {
          this.photos.push(nativepath)
        } else if (this.photos.length > 5) {
          this.presentToast('Vous ne pouvez pas sélectionner plus de 4 images')
        }
        alert(this.photos)
      })

    }, (err) => {
      // Handle error
      alert(err)

    });
  }


  uploadImage() {
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
          this.project.photo.push(base_url + options.fileName) 
          this.loading = false
        })
      }
  
    }

  }



  uploadImagePermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      result => {
        if (result.hasPermission) {
          // code
          this.uploadImages()
        } else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(result => {
            if (result.hasPermission) {
              // code
              this.uploadImages()
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


  uploadImages() {
    var interval = 0;
    var ref = this;
   
    function InnerFunc() {
      if (ref.photos.length) {
        const fileTransfer = ref.transfer.create()
        let options: FileUploadOptions = {
          fileKey: "photo",
          fileName: (Math.random() * 100000000000000000) + '.jpg',
          chunkedMode: false,
          mimeType: "image/jpeg",
          headers: {},
  
        }
  
        var serverUrl = base_url + 'upload-avatar'
        fileTransfer.upload(ref.photos[interval], serverUrl, options).then((data) => {
          interval++;
          if (interval < ref.photos.length) {
            this.loading = false
            this.project.photo.push(base_url + options.fileName)
            InnerFunc();
          } else {
            this.loading = false
            ref.addProject()
            ref.presentToast("Images envoyées")
          }
        })
      } else {
        ref.addProject()
      }
   
    }
    InnerFunc()
  }


  getProjects(userId) {
    this.authService.myInfos(userId).subscribe(res => {
      console.log(res)
      this.listProjects = res['projects']
      this.dataPass.sendProjects(this.listProjects);  
    }, error =>{
      console.log(error)
    })
  }

  addProject(){
    this.loading = true
    this.tags.length > 0 ? this.project.tags = this.tags : null
    this.photos.length > 0? this.uploadImage() : null
    this.contactService.addProject(this.project).subscribe(res =>{
      console.log(res);
      this.loading = false
      this.presentToast('Nouveau projet ajouté')
      let userId = localStorage.getItem('teepzyUserId')
      this.getProjects(userId)
      this.dismiss()
    }, error =>{
      console.log(error)
      this.loading = false
      this.presentToast('Oops! une erreur est survenue')
    })
  }

  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }


  ngOnDestroy() { 
    this.subscription?  this.subscription.unsubscribe() :  null
  }
}
