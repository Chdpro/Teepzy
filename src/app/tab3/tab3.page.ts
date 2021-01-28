import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ModalController, MenuController, ToastController } from '@ionic/angular';
//import { Socket } from 'ngx-socket-io';
import { ContactService } from '../providers/contact.service';
import { DatapasseService } from '../providers/datapasse.service';
import { Subscription, Observable } from 'rxjs';
import * as moment from 'moment';
import { Socket } from 'ng-socket-io';
import { CACHE_KEYS } from '../constant/constant';

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
      for (const r of this.rooms) {
        if (message['roomId'] == r['_id']) {
          r['lastMessage'][0] = message
        }
      }
      let rs = this.rooms.sort((a, b) => {
        if (b.lastMessage.length > 0 && a.lastMessage.length > 0) {
          return b.lastMessage[0].timeStamp - a.lastMessage[0].timeStamp
        }
      })
      this.rooms = rs

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
    let conversations = []
    this.contactService.mChatRooms(this.userId).subscribe(res => {
      let r = res['data']
      this.contactService.setLocalData(CACHE_KEYS.ROOMS, res)
      for (const room of r) {
        if (room['lastMessage'].length > 0) {
          conversations.push({
            connectedUsers: room.connectedUsers,
            connectedUsersInfo: room.connectedUsersInfo,
            lastMessage: room.lastMessage,
            name: room.name,
            userId: room.userId,
            userInitiator: room.userInitiator,
            _id: room._id,
            countUnreadMessages: room.countUnreadMessages

          })
        } else {

          let lastMessage = [{ timeStamp: room.createdAt.slice(0, 9).split('-').join('') + room.createdAt.slice(12, 16).split(':').join('') }]
          conversations.push({
            connectedUsers: room.connectedUsers,
            connectedUsersInfo: room.connectedUsersInfo,
            lastMessage: lastMessage,
            name: room.name,
            userId: room.userId,
            userInitiator: room.userInitiator,
            _id: room._id,
            countUnreadMessages: room.countUnreadMessages

          })
        }
      }
      this.rooms = conversations.sort((a, b) => {
        //console.log(b.lastMessage[0], a)
        if (b.lastMessage.length > 0 && a.lastMessage.length > 0) {
          return b.lastMessage[0].timeStamp - a.lastMessage[0].timeStamp
        }
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
