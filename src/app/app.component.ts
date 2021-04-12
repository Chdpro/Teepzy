import { Component } from '@angular/core';

import { Platform, NavController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { ContactService } from './providers/contact.service';
import { AuthService } from './providers/auth.service';
import { OneSignal, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { isCordovaAvailable } from '../common/is-cordova-available'
import { oneSignalAppId, sender_id } from 'src/config';
import { PERMISSION } from './constant/constant';
import { Socket } from 'ng-socket-io';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';



export enum ConnectionStatus {
  Online,
  Offline
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  navigate: any;
  userId = ''
  userInfo: any
  address: any

  androidPermissionsList = [
    PERMISSION.WRITE_EXTERNAL_STORAGE,
    PERMISSION.READ_EXTERNAL_STORAGE,
    PERMISSION.READ_CONTACTS,
    PERMISSION.WRITE_CONTACTS,
    PERMISSION.CAMERA,
  ];
  androidPermissionListVerified = []
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private navCtrl: NavController,
    public toastController: ToastController,
    private contactService: ContactService,
    private socket: Socket,
    private authService: AuthService,
    private oneSignal: OneSignal,
    private nativeGeocoder: NativeGeocoder,
  ) {

    this.initializeApp();
    this.sideMenu();
    this.oneSignale()
    const event = fromEvent(document, 'backbutton');
    event.subscribe(async () => {
      this.navCtrl.pop(); // I have used for my case
    });

    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "AIzaSyAtsHTJJtzF_V4G2oz4_8n7O2MrTZ8q6UU",
      authDomain: "newagent-d1b9b.firebaseapp.com",
      databaseURL: "https://newagent-d1b9b.firebaseio.com",
      projectId: "newagent-d1b9b",
      storageBucket: "newagent-d1b9b.appspot.com",
      messagingSenderId: "1034496750412",
      appId: "1:1034496750412:web:1c5a4da512652c3b51d5e9"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    let token = localStorage.getItem('teepzyToken')
    let id = localStorage.getItem('teepzyUserId')
    this.userId = id
    this.getPosition()
    this.getUserInfo(this.userId, token)
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString("#ea4d5075");
      this.splashScreen.hide();
    });
  }


  sideMenu() {
    this.navigate =
      [
        {
          title: "Home",
          url: "/home",
          icon: "home"
        },
        {
          title: "Chat",
          url: "/chat",
          icon: "chatboxes"
        },
        {
          title: "Contacts",
          url: "/contacts",
          icon: "contacts"
        },
      ]
  }



  private onPushOpened(payload: OSNotificationPayload) {
    // alert('Push received :' + payload.body)

  }

  private onPushReceived(payload: OSNotificationPayload) {
    // alert('Push opened: ' + payload.body)
  }

  oneSignale() {
    if (isCordovaAvailable) {
      this.oneSignal.startInit(oneSignalAppId, sender_id);
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
      this.oneSignal.handleNotificationReceived().subscribe(data => this.onPushReceived(data.payload));
      this.oneSignal.handleNotificationOpened().subscribe(data => {
        this.onPushOpened(data.notification.payload)
        this.router.navigateByUrl('/tabs/tab2')
      });
      this.oneSignal.endInit();
      // Then You Can Get Devices ID
      this.oneSignal.getIds().then(identity => {
      })
    }
  }


  getUserInfo(userId, token) {
    this.authService.myInfos(userId).subscribe(res => {
      // console.log(res)
      this.userInfo = res['data'];
      if (token && this.userInfo['isCompleted'] && this.userInfo['isAllProfileCompleted']) {
        // this.socket.emit('online', userId);
        let user = {
          userId: userId,
          isOnline: true
        }
        this.contactService.getConnected(user).subscribe(response => {
          //   console.log(res)
        })
        for (const apl of this.androidPermissionsList) {
          let storedPermission = localStorage.getItem(apl)
          if (storedPermission === null || storedPermission === "null") {
            this.router.navigateByUrl('/permissions', {
              replaceUrl: true
            })
          } else if (storedPermission) {
            this.androidPermissionListVerified.push(apl)
            if (this.androidPermissionListVerified.length === this.androidPermissionsList.length) {
              this.router.navigateByUrl('/tabs/tab1', {
                replaceUrl: true
              }
              )
            }
          }
        }

      } else if (token && this.userInfo['isCompleted'] && !this.userInfo['isAllProfileCompleted']) {
        for (const apl of this.androidPermissionsList) {
          let storedPermission = localStorage.getItem(apl)
          if (storedPermission === null || storedPermission === "null") {
            this.router.navigateByUrl('/permissions', {
              replaceUrl: true
            })
          } else if (storedPermission) {
            this.androidPermissionListVerified.push(apl)
            if (this.androidPermissionListVerified.length === this.androidPermissionsList.length) {
              this.router.navigateByUrl('/edit-profile', {
                replaceUrl: true
              }
              )
            }
          }
        }


      }
      else if (token && !this.userInfo['isCompleted']) {
        this.router.navigateByUrl('/signup-final', {
          replaceUrl: true
        }
        )
      }
      else if (!token) {
        this.router.navigateByUrl('/debut', {
          replaceUrl: true
        })
      }
    }, error => {
      // console.log(error)
      if (!token) {
        this.router.navigateByUrl('/debut', {
          replaceUrl: true
        }
        )
      }

    })
  }

  getOnline() {
    let user = { userId: this.userId, onlineDate: new Date(), adress: this.address }
    this.socket.emit('online', user);
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }
  public pos: any;

  public getPosition() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.pos = position;
      this.getAddress(this.pos.coords.latitude, this.pos.coords.longitude)
    });
  }

  // geocoder options
  nativeGeocoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  // get address using coordinates
  getAddress(lat, long) {
    this.nativeGeocoder.reverseGeocode(lat, long, this.nativeGeocoderOptions)
      .then((res: NativeGeocoderResult[]) => {
        this.address = res[0]
        this.getOnline()
      })
      .catch((error: any) => {
        //   alert('Error getting location' + JSON.stringify(error));
      });

  }



  logout() {
    localStorage.removeItem('teepzyUserId')
    localStorage.removeItem('teepzyToken')
    localStorage.removeItem('teepzyEmail')
    localStorage.removeItem('teepzyPhone')
    this.presentToast('Vous êtes bien déconnectés')
    this.router.navigateByUrl('/login', {
      replaceUrl: true
    })

  }

  goToEditInfo() {
    this.router.navigateByUrl('/edit-info')

  }

  goToEditPass() {
    this.router.navigateByUrl('/edit-pass')

  }

  goToReport() {
    this.router.navigateByUrl('/report-bug')

  }

  goToSuggest() {
    this.router.navigateByUrl('/suggest')

  }
  goToAutorisations() {
    this.router.navigateByUrl('/autorisation')
  }

  goToPrivacy() {
    this.router.navigateByUrl('/privacy')
  }


  goToConditions() {
    this.router.navigateByUrl('/conditions')
  }

  goToNotifications() {
    this.router.navigateByUrl('/notifications')
  }


  ngDoCheck() {

  }

  ngOnDestroy() {
    //  console.log('user has quit')
    let user = {
      userId: this.userId,
      isOnline: false
    }
    this.contactService.getConnected(user).subscribe(res => {
      //  console.log(res)
    })
    // this.socket.removeAllListeners('message');
  }

}
