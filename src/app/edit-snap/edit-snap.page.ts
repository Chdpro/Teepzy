import { Component, OnInit, Input } from '@angular/core';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ModalController, ToastController } from '@ionic/angular';
import { FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { base_url } from 'src/config';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AuthService } from '../providers/auth.service';
import { ContactService } from '../providers/contact.service';
import { MESSAGES } from '../constant/constant';
import { DatapasseService } from '../providers/datapasse.service';
import { Router } from '@angular/router';
import { File, DirectoryEntry, FileEntry } from '@ionic-native/file/ngx';
import { UploadService } from '../providers/upload.service';
import { FilePath } from '@ionic-native/file-path/ngx';


@Component({
  selector: 'app-edit-snap',
  templateUrl: './edit-snap.page.html',
  styleUrls: ['./edit-snap.page.scss'],
})
export class EditSnapPage implements OnInit {

  poste = {
    userId: '',
    content: '',
    video_url: '',
    userPhoto_url: '',
    backgroundColor: '#fff',
    userPseudo: ''
  }

  fileBase64 = {
    base64video: '',
    videoName: ''
  }

  videos = []
  listPosts = []
  user: any

  @Input() filePath: string;
  @Input() imgSrc: string;
  @Input() page: string
  filePathInBase64 = ''
  srcV;
  img;
  isPlay = false;
  post: any;
  video: any;
  isVideo = true;
  loading = false
  constructor(
    private webview: WebView,
    public modalController: ModalController,
    private toastController: ToastController,
    private transfer: FileTransfer,
    private androidPermissions: AndroidPermissions,
    private authService: AuthService,
    private contactService: ContactService,
    private dataPass: DatapasseService,
    private router: Router,
    private file: File,
    private uploadService: UploadService,
    private fileNPath: FilePath
  ) { }

  ngOnInit() {
    this.srcV = this.webview.convertFileSrc(this.filePath);
    this.img = this.imgSrc;
    //this.videos.push(this.filePath)
    if (this.page == 'snap') {
      alert('hello base64')
      this.getBase64StringByFilePath(this.filePath)
    } else {
      alert('hello resolve native')
      this.resolveNativePath(this.filePath)
    }
    this.poste.userId = localStorage.getItem('teepzyUserId');
    this.getUserInfo(this.poste.userId)
  }


  getBase64StringByFilePath(fileURL): Promise<string> {
    return new Promise((resolve, reject) => {
      let fileName = fileURL.substring(fileURL.lastIndexOf('/') + 1);
      let filePath = fileURL.substring(0, fileURL.lastIndexOf("/") + 1);
      alert(filePath)
      alert(fileName)
      this.file.readAsDataURL(filePath, fileName).then(
        file64 => {
          console.log(file64); //base64url...
          alert(file64)
          this.fileBase64.base64video = file64
          resolve(file64);
        }).catch(err => {
          reject(err);
        });
    })
  }

  uploadWithPost(){
    if (this.page == 'snap') {
      this.uploadBase64File()
    } else {
      this.addPostUsingPermission()
    }
  }

  uploadBase64File() {
    this.loading = true
    this.fileBase64.videoName = (Math.random() * 100000000000000000).toString()
    this.uploadService.uploadFileInBase64(this.fileBase64).subscribe(res => {
      alert(res)
      this.poste.video_url = base_url + this.fileBase64.videoName + '.mp4'
      this.loading = false
      this.addPost()
    }, error => {
      alert(JSON.stringify(error))
      this.loading = false

    })
  }


  resolveNativePath(videoData) {
    let videoPath = videoData
    this.fileNPath.resolveNativePath(videoPath).then((nativepath) => {
      if (this.videos.length == 0) {
        this.videos.push(nativepath)
      } else if (this.videos.length > 1) {
        this.presentToast(MESSAGES.MEDIA_LIMIT_ERROR)
      }
    }, error => {
        alert(JSON.stringify(error))
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


  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  changeVideo() {
    this.video = document.getElementById("video");
    if (this.video.paused) {
      this.video.play();
      this.isPlay = false;
    } else {
      this.video.pause();
      this.isPlay = true;
    }
  }


  uploadImage() {
    var ref = this;
    this.loading = true
    if (ref.videos.length > 0) {
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
        fileTransfer.upload(ref.videos[index], serverUrl, options).then(() => {
          this.poste.video_url = base_url + options.fileName;
          this.addPost()
          this.loading = false
          alert("upload worked!!")

        }, error => {
          this.loading = false
          alert("video upload did not work!" + JSON.stringify(error))

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
    this.requestNecessaryPermissions()
      .then(() => {
        this.uploadImage()
      }, error => {
        this.requestNecessaryPermissions()
          .then(() => {
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

}
