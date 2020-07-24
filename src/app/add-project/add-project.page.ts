import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
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
    photo: '',
    tags : [],
    description: '',
    logiciel: ''
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
    private contactService: ContactService) { 
 
     }

  ngOnInit() {
    let userId = localStorage.getItem('teepzyUserId')
    this.project.userId = userId

  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
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
        this.project.photo = "http://92.222.71.38:3000/" + options.fileName
        this.presentToast('Photo Mise à jour')
      })
    }

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


}
