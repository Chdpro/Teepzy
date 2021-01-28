import { Injectable } from '@angular/core';
import { ToastController, Platform } from '@ionic/angular';
import { Observable, fromEvent, merge, of } from 'rxjs';
import { mapTo } from 'rxjs/operators'
import { CACHE_KEYS } from '../constant/constant';


CACHE_KEYS
@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  online$: Observable<boolean>;
  name = ''
  isOnline:Boolean

  constructor(
    private toastController: ToastController,) {
   
    this.online$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    )
    this.networkStatus()
  }


  public networkStatus() {
    this.online$.subscribe(value => {
        this.isOnline = value
    })
    console.log(this.isOnline)
    return this.isOnline
  }



  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

}

