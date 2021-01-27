import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { ToastController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

export enum ConnectionStatus {
  Online,
  Offline
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline)
  constructor(
    private netWork: Network,
    private toastController: ToastController,
    private plt: Platform
  ) {
    this.plt.ready().then(() => {
      this.initializeNetworkEvents();
      let status = this.netWork.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
      this.status.next(status)
    })
  }


  initializeNetworkEvents() {
    this.netWork.onDisconnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Online) {
        console.log("We are Offline")
        this.updateNetworkStatus(ConnectionStatus.Offline)
      }
    });

    this.netWork.onChange().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Offline) {
        console.log("We are Online")
        this.updateNetworkStatus(ConnectionStatus.Online)
      }
    })
  }


  public async updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);
    let connection = status == ConnectionStatus.Offline ? 'Offline' : 'Online';
    this.presentToast('You are now ' + connection)
  }


  public onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }

  public getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

}

