import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ToastController, MenuController, AlertController, ModalController, IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
import { ContactService } from '../providers/contact.service';
import { AuthService } from '../providers/auth.service';
import { MatMenuTrigger } from '@angular/material';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { typeAccount, MESSAGES, CACHE_KEYS } from '../constant/constant';
import { AddPeopleRoomPage } from '../add-people-room/add-people-room.page';
import { DatapasseService } from '../providers/datapasse.service';
import { GroupInvitationPage } from '../group-invitation/group-invitation.page';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  loading = false
  messages = [];

  roomInitiator: any
  nickname = '';
  userId = ''
  stateO = {
    pseudo: '',
    roomLength: 0,
    name: '',
    connectedUserId: '',
    online: false,
    userId: ''
  }
  user: any
  photo = ''
  message = {
    userId: '',
    userFromId: '',
    FromMessageText: '',
    FromMessagePseudo: '',
    roomId: '',
    text: '',
    pseudo: '',
    messageRepliedId: '',
    isReply: false,
    createdAt: '',
    userPhoto_url: '',
    timeStamp: 0

  }

  repliedMessage = {
    messageId: '',
    text: '',
    userFromId: '',
    pseudo: '',
    createdAt: ''

  }

  room: any
  roomId = ''
  isInMyCircle = true
  menu = false
  subscription: Subscription;
  @ViewChild('clickHoverMenuTrigger', null) clickHoverMenuTrigger: MatMenuTrigger

  // used for scrolling the pane
  @ViewChild('scrollMe', null) private myScrollContainer: ElementRef;

  @ViewChild('content', null) private content: any;


  constructor(
    private router: Router,
    private contactService: ContactService,
    private authService: AuthService,
    private clipboard: Clipboard,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private modalController: ModalController,
    private dataPasse: DatapasseService,
    private socket: Socket
  ) {
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
    this.subscription = this.dataPasse.getRoom().subscribe(room => {
      if (room) {
        this.stateO.name = room.name
        this.stateO.roomLength = room.connectedUsers.length
      }
    });
    const state = this.router.getCurrentNavigation().extras.state
    this.stateO.pseudo = state.pseudo
    this.stateO.name = state.roomName
    this.stateO.roomLength = state.roomLength
    this.stateO.connectedUserId = state.connectedUserId
    this.stateO.userId = state.userId
    this.roomId = state.roomId
    this.coonectSocket()
    this.getMessagesBySocket().subscribe(message => {
      // console.log(message)
      message['roomId'] == state.roomId ? this.messages.push(message) : null
    });
    this.getRoomWhoseMessageIsReadBySocket().subscribe(roomId => {
      //  console.log(roomId)
      if (roomId == state.roomId) {
        for (const message of this.messages) {
          if (message.userId == this.userId && message.isRead === false) {
            message.isRead = true
          }
        }

      }
    })

    this.deleteMessageFromSocket()
    this.disconnectUserSocket()
  }

  ngOnInit() {
    const state = this.router.getCurrentNavigation().extras.state
    this.userId = localStorage.getItem('teepzyUserId');
    this.getUser()
    this.message.userId = this.userId
    this.message.pseudo = state.pseudo
    this.message.roomId = state.roomId
    this.photo = state.photo
    // console.log(state)
    this.checkUserInMyCircle(this.userId, this.stateO.connectedUserId)
    this.getMessages(state.roomId)
    this.markMessagesRead(state.roomId, this.userId)
    // this.scrollToBottomOnInit();

  }


  ionViewWillEnter() {
    this.scrollToBottomOnInit();
  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  scrollToBottomOnInit() {
    this.content.scrollToBottom(300);
  }

  markMessagesRead(roomId, userId) {
    let room = {
      roomId: roomId,
      currentUserOnlineId: userId
    }
    this.contactService.markReadMessages(room).subscribe(res => {
      //  console.log(res)
    }, error => {
      console.log(error)
    })
    //  console.log(this.message.createdAt)
  }


  replyto(msg) {
    this.message.isReply = true
    this.repliedMessage.pseudo = msg.pseudo;
    this.repliedMessage.text = msg.text;
    this.repliedMessage.userFromId = msg.userId
    msg.messageRepliedId ? this.repliedMessage.messageId = msg.messageRepliedId : this.repliedMessage.messageId = msg._id

  }

  close() {
    this.message.isReply = false
    this.repliedMessage.pseudo = '';
    this.repliedMessage.text = '';
    this.repliedMessage.userFromId = ''
    this.repliedMessage.messageId = ''
    // console.log(this.repliedMessage)
  }


  getRoom() {

  }


  checkUserInMyCircle(userId, connectedUserId) {
    if (userId == connectedUserId) {
      let check = {
        userId: connectedUserId,
        connectedUserId: userId
      }
      this.contactService.checkInMyCircle(check).subscribe(res => {
        //   console.log(res)
        res['data'] == false ? this.isInMyCircle = false : this.isInMyCircle = true
      }, error => {
        //  console.log(error)
      })
    } else {
      let check = {
        userId: userId,
        connectedUserId: connectedUserId
      }
      this.contactService.checkInMyCircle(check).subscribe(res => {
        //   console.log(res)
        res['data'] == false ? this.isInMyCircle = false : this.isInMyCircle = true
      }, error => {
        // console.log(error)
      })
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Envoyer une invitation?',
      message: 'Envoyez votre invitation pour devenir des TeppZrs connectés .',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //    console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Oui',
          handler: () => {
            this.sendInvitationToJoinCircle()
          }
        }
      ]
    });

    await alert.present();
  }


  sendInvitationToJoinCircle() {
    this.loading = true
    if (this.userId == this.stateO.connectedUserId) {
      let invitation = {
        idSender: this.stateO.connectedUserId,
        idReceiver: this.stateO.userId,
        typeLink: typeAccount.pseudoIntime
      }
      // console.log(invitation)

      this.contactService.inviteToJoinCircle(invitation).subscribe(res => {
        //   console.log(res)
        this.presentToast(MESSAGES.INVITATION_SEND_OK)
        this.isInMyCircle = true
        //   this.socket.emit('notification', 'notification');
        this.loading = false
      }, error => {
        this.presentToast(MESSAGES.INVITATION_SEND_ERROR)
        this.loading = false
      })
    } else {
      let invitation = {
        idSender: this.stateO.userId,
        idReceiver: this.stateO.connectedUserId,
        typeLink: typeAccount.pseudoIntime
      }
      // console.log(invitation)
      this.contactService.inviteToJoinCircle(invitation).subscribe(res => {
        //   console.log(res)
        this.presentToast(MESSAGES.INVITATION_SEND_OK)
        this.isInMyCircle = true
        //   this.socket.emit('notification', 'notification');
        this.loading = false
      }, error => {
        this.presentToast(MESSAGES.INVITATION_SEND_ERROR)
        this.loading = false
      })
    }
  }


  getCurrentTime() {
    var date = new Date();
    let d = date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit'
    });
    return d
  }

  sendMessage() {
    let currentTime = new Date()
    this.message.userPhoto_url = this.user.photo
    this.message.createdAt = currentTime.toLocaleDateString() + "T" + this.getCurrentTime()
    let t = currentTime.toLocaleDateString().split('/').reverse().join('') + this.getCurrentTime().split(':').join('')
    this.message.timeStamp = parseInt(t)
    console.log(parseInt(t))
    if (!this.message.isReply) {
      this.socket.emit('add-message', this.message);
      this.message.text = '';
    } else {
      this.message.FromMessagePseudo = this.repliedMessage.pseudo
      this.message.messageRepliedId = this.repliedMessage.messageId
      this.message.userFromId = this.repliedMessage.userFromId
      this.message.FromMessageText = this.repliedMessage.text
      this.message.userPhoto_url = this.user.photo
      this.message.timeStamp = parseInt(t)
      //  console.log(res)
      this.socket.emit('add-message', this.message);
      this.message.text = '';
      this.close()
    }

  }

  async presentAddPeopleModal() {
    const modal = await this.modalController.create({
      component: AddPeopleRoomPage,
      cssClass: 'my-custom-class',
      componentProps: {
        connectedUsers: this.room.connectedUsers,
        //messages: this.room.messages,
        name: this.room.name,
        userId: this.room.userId,
        _id: this.roomId
      }
    });
    return await modal.present();
  }


  async presentAddInvitationModal() {
    const modal = await this.modalController.create({
      component: GroupInvitationPage,
      cssClass: 'my-custom-class',
      componentProps: {
        roomId: this.roomId
      }
    });
    return await modal.present();
  }

  getRoomWhoseMessageIsReadBySocket() {
    let observable = new Observable(observer => {
      this.socket.on('roomWhoseMessagesRead', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  addMessageToFavorite(messageId) {
    let favoris = {
      userId: this.userId,
      messageId: messageId,
      type: 'MESSAGE'
    }
    this.contactService.addMessageFavorite(favoris).subscribe(res => {
      //  console.log(res)
      this.showToast('Ajouté aux favoris')
    }, error => {
      this.showToast('Oops! une erreur est survenue')
      //  console.log(error)
    })
  }

  deleteMessage(messageId) {
    let message = {
      messageId: messageId
    }
    this.socket.emit('message-to-delete', message);
  }

  coonectSocket() {
    /* this.socket.fromEvent('user-online').subscribe(notif => {
       console.log(notif)
       notif['userId'] == this.stateO.connectedUserId ? this.stateO.online = true : null
     });
     */
  }

  disconnectUserSocket() {
    /* this.socket.fromEvent('user-outline').subscribe(notif => {
      // console.log(notif)
      notif['userId'] == this.stateO.connectedUserId ? this.stateO.online = false : null
    });*/
    //this.socket.disconnect();

  }

  deleteMessageFromSocket() {
    this.socket.fromEvent('delete-message').subscribe(messageId => {
      console.log(messageId)
      if (this.checkAvailability(this.messages, messageId)) {
        let list = this.deleteObjectFromList(this.messages, messageId)
        this.messages = list
      }
    });
  }


  checkAvailability(arr, val) {
    return arr.some(function (arrVal) {
      return val === arrVal['_id'];
    });
  }

  deleteObjectFromList(list, id) {
    let removeIndex = list.map(function (item) { return item._id; }).indexOf(id);
    // remove object
    list.splice(removeIndex, 1);
    return list
  }


  test(msg) {
    //   console.log(msg)
  }

  onLongPressing() {
    this.clickHoverMenuTrigger.openMenu();
  }

  getMessages(id) {
    this.loading = true
    let obj = {
      roomId: id,
      userId: this.userId
    }
    this.contactService.ChatRoomMessages(obj).subscribe(res => {
      //  console.log(res)
      this.loading = false
      let roomInitiatorId = res['data']['userId']
      this.room = res['data']
      this.getChatRoomUserInitiator(roomInitiatorId)
      this.messages = res['data']['messages']
      this.contactService.setLocalData(CACHE_KEYS.CHAT + id, res);
    }, error => {
      //  console.log(error)
      this.loading = false

    })

  }

  getMessagesBySocket() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  getChatRoomUserInitiator(id) {
    this.authService.myInfos(id).subscribe(res => {
      //  console.log(res)
      this.roomInitiator = res['data']
      // console.log(this.roomInitiator)
      //    this.message.pseudo = this.user.pseudoPro
    }, error => {
      //  console.log(error)
    })
  }

  getUser() {
    this.authService.myInfos(this.userId).subscribe(res => {
      //  console.log(res)
      this.user = res['data']
      this.message.pseudo = this.user.pseudoIntime
    }, error => {
      // console.log(error)
    })
  }

  getUsers() {
    /* let observable = new Observable(observer => {
       this.socket.on('users-changed', (data) => {
         observer.next(data);
       });
     });
     return observable;*/
  }

  copyMessage(text) {
    this.clipboard.copy(text).then(res => {
      this.showToast("message copié")
    });

  }
  ionViewWillLeave() {
    // this.socket.disconnect();
    this.subscription ? this.subscription.unsubscribe() : null

  }

  async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }


  scrollToBottom(): void {
    // method used to enable scrolling
    this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  }
  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null
    //  this.socket.removeAllListeners('message');
    //this.socket.removeAllListeners('users-changed');
  }


}
