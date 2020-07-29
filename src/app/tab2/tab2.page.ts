import { Component, OnInit, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { ContactService } from '../providers/contact.service';
import { ToastController, MenuController } from '@ionic/angular';
import * as moment from 'moment';
import { MatTabGroup, MatTab } from '@angular/material';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {


  userId = ''
  invitations = []
  notifications = []

  loading = false

  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public selected: number;

  message = '';
  messages = [];
  currentUser = '';



  private swipeCoord?: [number, number];
  private swipeTime?: number;

  selectedTab = 0

  constructor(
    private contactService: ContactService,
    private menuCtrl: MenuController,
    private toastController: ToastController,
    private socket: Socket
  ) {
    this.menuCtrl.enable(true);
    this.menuCtrl.swipeGesture(true);
  }



  ngOnInit() {
    this.coonectSocket()
    this.userId = localStorage.getItem('teepzyUserId');
    this.listInvitations()
    this.listNotifications()
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

  swipe(e: TouchEvent, when: string): void {
    console.log('swipe up')
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
        switch (swipe) {
          case 'previous':
            if (this.selected > 0) { this.selected--; }
            break;
          case 'next':
            if (this.selected < this.tabGroup._tabs.length - 1) { this.selected++; }
            break;
        }
      }
    }
  }

  coonectSocket() {
    this.socket.connect();
    let name = `user-${new Date().getTime()}`;
    this.currentUser = name;
    this.socket.emit('set-name', name);
    this.socket.fromEvent('users-changed').subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        console.log('User left: ' + user);
      } else {
        console.log('User joined: ' + user);
      }
    });

    this.socket.fromEvent('message').subscribe(message => {
      this.messages.push(message);
      console.log(message)

    });

    this.socket.emit('notifications', 'notifications');
    this.socket.fromEvent('user-notifications').subscribe(notif => {
      console.log(notif)
    });
  }

  sendMessage() {
    this.socket.emit('send-message', { text: this.message });
    this.message = '';
  }

  doRefreshNotification(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      console.log('Async operation has ended');
      this.listNotifications()
      event.target.complete();
    }, 400);
  }

  doRefreshInvitation(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      console.log('Async operation has ended');
      this.listInvitations()
      event.target.complete();
    }, 400);
  }


  listInvitations() {
    let invitation = {
      idReceiver: this.userId
    }
    this.contactService.listInivtation(invitation).subscribe(res => {
      console.log(res)
      this.invitations = res['data']
    }, error => {
      console.log(error)
    })
  }

  listNotifications() {
    this.contactService.listNotification(this.userId).subscribe(res => {
      console.log(res)
      this.notifications = res['data']
    }, error => {
      console.log(error)
    })
  }

  time(date) {
    moment.locale('fr');
    return moment(date).fromNow()
  }


  trackByFn(index, item) {
    return index; // or item.id
  }

  acceptInvitation(I) {
    let invitation = {
      idReceiver: this.userId,
      idInvitation: I['_id'],
      typeLink: I['typeLink'],
      idSender: I['senderId']
    }
    this.loading = true
    this.contactService.acceptInvitation(invitation).subscribe(res => {
      console.log(res)
      this.loading = false
      this.listInvitations()
      this.presentToast('Vous désormais en contact')
    }, error => {
      console.log(error)
      this.loading = false
    })
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

  async showToast(msg) {
    let toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }


  ionViewWillLeave() {
    this.socket.disconnect();
    console.log('disconnected')
  }

}
