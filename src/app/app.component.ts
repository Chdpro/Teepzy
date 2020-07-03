import { Component } from '@angular/core';

import { Platform, NavController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  navigate : any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private navCtrl:NavController,
    public toastController: ToastController,


  ) {
    this.sideMenu();

    this.initializeApp();

    const event = fromEvent(document, 'backbutton');
    event.subscribe(async () => {
      // logic for navigation, modal, popover, menu closing
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
/*
if (token) {
   this.router.navigateByUrl('/tabs/tab1', {
     replaceUrl: true
   }
   )
  }else if(!token){
   this.router.navigateByUrl('/login', {
     replaceUrl: true
   }
   )
  }*/
}

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }


  sideMenu()
  {
    this.navigate =
    [
      {
        title : "Home",
        url   : "/home",
        icon  : "home"
      },
      {
        title : "Chat",
        url   : "/chat",
        icon  : "chatboxes"
      },
      {
        title : "Contacts",
        url   : "/contacts",
        icon  : "contacts"
      },
    ]
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }


  logout(){
    localStorage.removeItem('teepzyUserId')
    localStorage.removeItem('teepzyToken')
    localStorage.removeItem('teepzyEmail')
    this.presentToast('Vous êtes bien déconnectés')
    this.router.navigateByUrl('/login', {
      replaceUrl: true
    })

  }
}
