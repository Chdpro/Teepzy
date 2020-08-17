import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { AuthService } from '../providers/auth.service';
import { DatapasseService } from '../providers/datapasse.service';
import { Subscription } from 'rxjs';
import { ModalController, ToastController, ActionSheetController } from '@ionic/angular';
import { ContactService } from '../providers/contact.service';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { base_url } from 'src/config';
import { FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer/ngx';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {


  title = 'E-shop'
  product = {
    userId: '',
    nom: '',
    photo: 'http://teepzy.com/product.jpg',
    tags : [],
    description: '',
    price: ''
  }

  subscription: Subscription;  
  listProducts = []
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
  showModal = 'hidden'
  constructor(private modalController: ModalController, 
    private toasterController: ToastController,
    private authService: AuthService,
    private dataPass: DatapasseService,
    private camera: Camera,
    private filePath: FilePath,
    public actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
    private contactService: ContactService) { }

    ngOnInit() {
      let userId = localStorage.getItem('teepzyUserId')
      this.product.userId = userId
  
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
  
    getProducts(userId) {
      this.authService.myInfos(userId).subscribe(res => {
        console.log(res)
        this.listProducts = res['products']
        this.dataPass.sendProducts(this.listProducts);  
      }, error =>{
        console.log(error)
      })
    }
  
    addProduct(){
      this.loading = true
      this.tags.length > 0 ? this.product.tags = this.tags : null;
      this.photos.length > 0 ? this.uploadImage() : null
      this.contactService.addProduct(this.product).subscribe(res =>{
        console.log(res);
        this.loading = false
        this.presentToast('Nouveau produit ajouté');
        let userId = localStorage.getItem('teepzyUserId')
        this.getProducts(userId)
        this.dismiss()
      }, error =>{
        console.log(error)
        this.loading = false
        this.presentToast('Oops! une erreur est survenue')
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
          fileKey: "avatar",
          fileName: (Math.random() * 100000000000000000) + '.jpg',
          chunkedMode: false,
          mimeType: "image/jpeg",
          headers: {},
        }
        var serverUrl = base_url + 'upload-avatar'
        this.filesName.push({ fileUrl: base_url + options.fileName, type: 'image' })
        fileTransfer.upload(ref.photos[index], serverUrl, options).then(() => {
          this.product.photo = base_url + options.fileName
          this.presentToast('Photo Mise à jour')
        })
      }
  
    }
  
    async presentToast(msg) {
      const toast = await this.toasterController.create({
        message: msg,
        duration: 4000
      });
      toast.present();
    }
  

}
