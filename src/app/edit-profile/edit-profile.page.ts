import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { ContactService } from '../providers/contact.service';
import { ToastController, LoadingController, ActionSheetController, MenuController } from '@ionic/angular';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { base_url } from 'src/config';
import { FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DatapasseService } from '../providers/datapasse.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { MESSAGES } from '../constant/constant';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  profile1 = {
    pseudoIntime: '',
    localisation: 'localisation',
    metier: 'metier',
    userId: '',
    siteweb: 'siteweb',
    socialsAmical: [],
    hobbies: [],
    bio: 'bio',
    photo: '',
    tagsLabel:'Hobbies',
    bioLabel:'Biographie'
  }


  socials = []
  socialsAdded = []
  socialsAdde2 = []

  user: any
  rs_url = ''
  rs_url2 = ''

  media: any
  media2: any



  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags = [

  ];

  visible1 = true;
  selectable1 = true;
  removable1 = true;
  removable2 = true;
  removable3 = true;


  addOnBlur1 = true;
  readonly separatorKeysCodes1: number[] = [ENTER, COMMA];
  tags1 = [

  ];

  tab1 = 0
  tab2 = 0

  loading = false


  photos: any = [];
  filesName = new Array();
  dispImags = []
  showModal = 'hidden'

  private swipeCoord?: [number, number];
  private swipeTime?: number;

  selectedTab = 0
  subcription: Subscription

  isEditableB = false
  isEditableH = false

  constructor(private authService: AuthService,
    private contactService: ContactService,
    private camera: Camera,
    private filePath: FilePath,
    public actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
    private menuCtrl: MenuController,
    private router: Router,
    private dataPasse: DatapasseService,
    private androidPermissions: AndroidPermissions,
    private toasterController: ToastController) {
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getSocials();
    let userId = localStorage.getItem('teepzyUserId')
    this.profile1.userId = userId;
    this.getUserInfo(userId)
  }


  swipe2(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();
    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;
      if (duration < 1000 //
        && Math.abs(direction[0]) > 30 // Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
        const swipe = direction[0] < 0 ? 'next' : 'previous';
        console.info(swipe);
        if (swipe === 'next') {
          const isFirst = this.selectedTab === 0;
          if (this.selectedTab <= 2) {
            this.selectedTab = isFirst ? 1 : this.selectedTab + 1;
          }
          console.log("Swipe left - INDEX: " + this.selectedTab);
        } else if (swipe === 'previous') {
          const isLast = this.selectedTab === 2;
          if (this.selectedTab >= 1) {
            this.selectedTab = this.selectedTab - 1;
          }
          console.log("Swipe right — INDEX: " + this.selectedTab);
        }
        // Do whatever you want with swipe
      }
    }
  }

  updateProfile() {
    this.loading = true
    let userId = localStorage.getItem('teepzyUserId')
    // update profile 1
    this.tags.length > 0 ? this.profile1.hobbies = this.tags : null
    console.log(this.profile1.hobbies)
    this.authService.updateProfile(this.profile1).subscribe(res => {
      console.log(res)
      this.presentToast(MESSAGES.PROFILE_UPDATED_OK)
      this.getUserInfo(userId)
      this.loading = false
      this.router.navigate(['/tabs/profile'])
    }, error => {
      console.log(error)
      this.presentToast(MESSAGES.PROFILE_UPDATED_ERROR)
      this.loading = false

    })

  }


  checkAvailability(arr, val) {
    return arr.some(function (arrVal) {
      return val === arrVal['_id'];
    });
  }
  addSocial() {
    let sociale = {
      _id: this.media['_id'],
      icon: this.media['icon'],
      nom: this.media['nom'],
      url: this.rs_url,
      type: this.media['type']
    }

    this.checkAvailability(this.socialsAdded, sociale['_id']) ? this.presentToast('Ce média a été déjà ajouté') : this.socialsAdded.push(sociale)
  }


  addSocialProfile2() {
    let sociale = {
      _id: this.media2['_id'],
      icon: this.media2['icon'],
      nom: this.media2['nom'],
      url: this.rs_url2,
      type: this.media2['type']
    }
    this.checkAvailability(this.socialsAdde2, sociale['_id']) ? this.presentToast('Ce média a été déjà ajouté') : this.socialsAdde2.push(sociale)

  }


  getSocials() {
    this.contactService.getSocials().subscribe(res => {
      console.log(res)
      this.socials = res
    }, error => {
      console.log(error)
    })
  }

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
      console.log(res)
      this.user = res['data'];
      this.dataPasse.send(this.user)
      this.profile1.pseudoIntime = this.user['pseudoIntime'];
      this.profile1.bio = this.user['bio'];
      this.profile1.localisation = this.user['localisation'];
      this.profile1.metier = this.user['metier'];
      this.profile1.siteweb = this.user['siteweb'];
      this.user['socialsAmical'] ? this.socialsAdde2 = this.user['socialsAmical'] : null;
      this.profile1.socialsAmical = this.user['socialsAmical'];
      this.profile1.tagsLabel = this.user['tagsLabel'];
      this.profile1.bioLabel  = this.user['bioLabel'];
      //this.profile1.tags = this.user['tags'];
      //this.user['tags'] ? this.tags1 = this.user['tags'] : null;
      this.user['hobbies'] ? this.tags = this.user['hobbies'] : null;
      this.profile1.hobbies = this.user['hobbies'];
      //this.user['photo'] ? this.dispImags[0] = this.user['photo'] : null
      this.user['photo'] ? this.profile1.photo = this.user['photo'] : null

    }, error => {
      console.log(error)
    })
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

  add1(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags1.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove1(tag): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  remove2(tag): void {
    const index = this.tags1.indexOf(tag);
    if (index >= 0) {
      this.tags1.splice(index, 1);
    }
  }

  remove3(tag): void {
    const index = this.socialsAdde2.indexOf(tag);
    if (index >= 0) {
      this.socialsAdde2.splice(index, 1);
    }
  }

  remove(tag): void {
    const index = this.socialsAdded.indexOf(tag);
    if (index >= 0) {
      this.socialsAdded.splice(index, 1);
    }
  }


  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Choisir dans votre galerie',
        handler: () => {
          this.pickImagePermission(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Utiliser la Camera',
        handler: () => {
          this.pickImagePermission(this.camera.PictureSourceType.CAMERA);
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

      if (this.dispImags.length == 0) {
        this.dispImags.push((<any>window).Ionic.WebView.convertFileSrc(imageData))
        this.filePath.resolveNativePath(imageData).then((nativepath) => {
          if (this.photos.length == 0) {
            this.photos.push(nativepath)
          }
        })
      } else if (this.dispImags.length > 1) {
        this.presentToast(MESSAGES.MEDIA_LIMIT_ERROR)
      }
  

    }, (err) => {
      // Handle error
      alert(JSON.stringify(err))

    });
  }


  updateProfileUsingPermission() {
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
          this.profile1.photo = base_url + options.fileName
          this.updateProfile()
          this.loading = false
          //this.photos = [],
          this.dispImags = []
        }, error => {
          alert(JSON.stringify(error))

        })
      }

    } else {
      this.loading = false
      this.updateProfile()

    }

  }



  shwModal() {
    console.log(this.showModal)
    if (this.showModal === 'hidden') {
      this.showModal = 'visible'

    } else {
      this.showModal = 'hidden'
    }

  }


  swithEditModeB() {
    this.isEditableB ? this.isEditableB = false : this.isEditableB = true
    console.log(this.isEditableB)
  }
  swithEditModeH() {
    this.isEditableH ? this.isEditableH = false : this.isEditableH = true
    console.log(this.isEditableH)

  }

  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

  ngOnDestroy() {
    this.subcription ? this.subcription.unsubscribe() : null
  }
}
