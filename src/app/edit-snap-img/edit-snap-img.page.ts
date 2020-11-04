import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AuthService } from '../providers/auth.service';
import { ContactService } from '../providers/contact.service';
import { DatapasseService } from '../providers/datapasse.service';
import { FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { base_url } from 'src/config';
import { MESSAGES } from '../constant/constant';
import { Router } from '@angular/router';
import { FilePath } from '@ionic-native/file-path/ngx';
import { UploadService } from '../providers/upload.service';
import { Base64 } from '@ionic-native/base64/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-edit-snap-img',
  templateUrl: './edit-snap-img.page.html',
  styleUrls: ['./edit-snap-img.page.scss'],
})
export class EditSnapImgPage implements OnInit {
  @Input() filePath: string;
  srcV;
  post: any;
  photos = []
  loading = false
  poste = {
    userId: '',
    content: '',
    video_url: '',
    userPhoto_url: '',
    image_url: '',
    backgroundColor: '#fff',
    userPseudo: ''
  }

  listPosts = []
  user: any



  fileBase64 = {
    base64image: '',
    imageName: ''
  }

  constructor(
    private router: Router,
    public modalController: ModalController,
    private toastController: ToastController,
    private transfer: FileTransfer,
    private androidPermissions: AndroidPermissions,
    private authService: AuthService,
    private contactService: ContactService,
    private dataPass: DatapasseService,
    private uploadService: UploadService,
    private base64: Base64,
    private fileNPath: FilePath,
    private file: File
  ) { }

  ngOnInit() {
    this.srcV = "data:image/jpeg;base64," + this.filePath;
    this.photos.push(this.filePath)
    // this.fileBase64.base64image = this.srcV
    this.resolveNativePath(this.filePath)
    this.poste.userId = localStorage.getItem('teepzyUserId');
    this.getUserInfo(this.poste.userId)
  }

  
  resolveNativePath(fileUri) {
    this.requestNecessaryPermissions().then(()=>{
      this.file.resolveLocalFilesystemUrl(fileUri).then((entry) => {
        alert("inside local file system path")
        this.convertToBase64(entry)
      }, error => {
        alert(JSON.stringify(error))
      })
    }, err =>{
      alert(JSON.stringify(err))
    })
   

  }


  convertToBase64(filePath) {
    this.base64.encodeFile(filePath).then((base64File: string) => {
      //console.log(base64File);
      alert("inside base64 convertor")
      this.fileBase64.base64image = base64File
    }, (err) => {
      console.log(err);
      alert(JSON.stringify(err))
    });
  }

  uploadBase64File() {
    this.loading = true
    this.fileBase64.imageName = (Math.random() * 100000000000000000).toString()
    this.uploadService.uploadFileInBase64(this.fileBase64).subscribe(res => {
      console.log(res)
      this.poste.image_url = base_url + this.fileBase64.imageName + ".jpeg"
      this.addPost()
      this.loading = false

    }, error => {
      console.log(error)
      this.loading = false
    })
  }

  requestNecessaryPermissions() {
    // Change this array to conform with the permissions you need
    const androidPermissionsList = [
      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
      this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
      this.androidPermissions.PERMISSION.READ_PHONE_STATE,
      this.androidPermissions.PERMISSION.WRITE_PHONE_STATE,

    ];
    return this.androidPermissions.requestPermissions(androidPermissionsList);
  }

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
      // console.log(res)
      this.user = res['data'];
      // this.user['photo'] ? this.userPhoto[0] = this.user['photo'] : null
    }, error => {
      //  console.log(error)
    })
  }



  uploadImage() {
    var ref = this;
    this.loading = true
    if (ref.photos.length > 0) {
      for (let index = 0; index < ref.photos.length; index++) {
        // interval++
        alert("inside loop of upload")
        const fileTransfer = ref.transfer.create()
        let options: FileUploadOptions = {
          fileKey: "avatar",
          fileName: (Math.random() * 100000000000000000) + '.jpg',
          chunkedMode: false,
          mimeType: "video/mp4",
          headers: {},
        }
        var serverUrl = base_url + 'upload-avatar'
        fileTransfer.upload(ref.photos[index], serverUrl, options).then(() => {
          this.poste.image_url = base_url + options.fileName;
          this.addPost()
          this.loading = false
          alert("upload worked!!")

        }, error => {
          this.loading = false
          alert("Not worked" + JSON.stringify(error))

        })
      }


    }


  }

  addPost() {
    this.loading = true
    this.poste.userPhoto_url = this.user.photo
    this.poste.userPseudo = this.user.pseudoIntime
    //this.photos.length > 0 ? this.uploadImage() : null
    this.contactService.addPost(this.poste).subscribe(res => {
      // console.log(res);
      if (res['status'] == 200) {
        this.getPosts(this.poste.userId)
        this.loading = false
        this.dismiss()
        this.router.navigate(["/tabs/tab1"]);

      }
    }, error => {
      // console.log(error)
      this.loading = false
      this.presentToast(MESSAGES.ADD_FEED_ERROR)

    })
  }

  getPosts(userId) {
    this.contactService.getPosts(userId).subscribe(res => {
      // console.log(res)
      this.listPosts = res['data']
      this.dataPass.sendPosts(this.listPosts);
      this.dismiss()
      this.presentToast(MESSAGES.ADD_FEED_OK)

    }, error => {
      // console.log(error)
    })
  }



  addPostUsingPermission() {
    this.requestNecessaryPermissions().then(() => {
      this.uploadImage()
    }, error => {
      this.requestNecessaryPermissions().then(() => {
        this.uploadImage()
      })
    })
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  submit(value) {
    alert(value);
  }
}
