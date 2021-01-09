import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ModalController, MenuController, ToastController } from '@ionic/angular';
//import { Socket } from 'ngx-socket-io';
import { ContactService } from '../providers/contact.service';
import { DatapasseService } from '../providers/datapasse.service';
import { Subscription, Observable } from 'rxjs';
import * as moment from 'moment';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  nickname = 'Christian';
  userId = ''
  members = []
  rooms = []
  subscription: Subscription;
  loading = false
  search: any
  showSearch = false
  constructor(public navCtrl: NavController,
    private router: Router,
    private contactService: ContactService,
    public modalController: ModalController,
    private socket: Socket,
    private dataPasse: DatapasseService,
    private menuCtrl: MenuController,
    private toastController: ToastController,
  ) {
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
    this.getNewRoomBySocket().subscribe(room => {
      console.log(room)
      room['userId'] == this.userId ? this.rooms.push(room) : null
    });
    
// Order rooms positions depending on timeStamp
    this.getMessagesBySocket().subscribe(message => {
      console.log(this.rooms)
      for (const r of this.rooms) {
        if (message['roomId'] == r['_id']) {
          this.getChatRooms()
      } 
      }
    });
    this.subscription = this.dataPasse.get().subscribe(list => {
      // console.log(list)
      if (list.length > 0) {
        this.rooms = list
      }
    });
  }

  list = [
    {
      name: 'christian',
      timestamp: 202101090955
    },
    {
      name: 'linda',
      timestamp: 202101091558
    },
    {
      name: 'Kokou',
      timestamp: 202101091554
    }
  ]

  ngOnInit() {
    this.list.sort((a, b) => {
      return b.timestamp - a.timestamp
    })
    console.log(this.list)
  }


  ionViewWillEnter() {

    this.userId = localStorage.getItem('teepzyUserId');
    // this.socket.emit('online', this.userId);
    this.getUsersOfCircle()
    this.getChatRooms()

  }


  trackByFn(index, item) {
    return index; // or item.id
  }

  getMessagesBySocket() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }


  doRefresh(event) {
    //console.log('Begin async operation');
    setTimeout(() => {
      //console.log('Async operation has ended');
      this.getChatRooms()
      event.target.complete();
    }, 400);
  }


  getUsersOfCircle() {
    this.contactService.getCircleMembers(this.userId).subscribe(res => {
      //console.log(res);
      this.members = res['data']
    }, error => {
      // console.log(error)
    })
  }

  removeRoom(roomId) {
    this.contactService.removeRoom(roomId).subscribe(res => {
      //console.log(res);
      this.showToast("Conversation Supprimée")
      this.getChatRooms()
    }, error => {
      // console.log(error)
    })
  }

  getChatRooms() {
    this.loading = true
    this.contactService.mChatRooms(this.userId).subscribe(res => {
      console.log(res);
      //this.rooms = res['data']
      this.rooms = res['data'].sort((a, b) => {
      return b.lastMessage[0].timeStamp - a.lastMessage[0].timeStamp
    })
    console.log(this.rooms)
      this.loading = false
    }, error => {
      //console.log(error)
      this.loading = false
    })
  }

  getNewRoomBySocket() {
    let observable = new Observable(observer => {
      this.socket.on('new-room', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }


  async showToast(msg) {
    let toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }


  async presentModal() {
    this.router.navigate(['/circle-members'])
  }


  goToContacts() {
    this.router.navigate(['/contacts', { previousUrl: 'feeds' }])

  }

  goToSearch() {
    this.router.navigateByUrl('/search')
  }

  gotoChatRoom(roomId, pseudo, photo, roomLength, roomName, connectedUserId, userId) {
    //console.log(roomId, pseudo, photo)
    //this.socket.emit('set-nickname', this.nickname);
    this.navCtrl.navigateForward("/chat",
      {
        state: {
          nickname: this.nickname, roomId: roomId, pseudo: pseudo,
          photo: photo, roomLength: roomLength, roomName, connectedUserId: connectedUserId, userId: userId
        }
      });
    // this.router.navigateByUrl('/chat')

  }

  ionViewWillLeave() {
    // this.socket.disconnect();
    //console.log('disconnected')
    this.subscription ? this.subscription.unsubscribe() : null

  }
  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null
    //this.socket.removeAllListeners('message');
    //this.socket.removeAllListeners('users-changed');
  }
}
