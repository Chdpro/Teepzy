import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NavController, NavParams, ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { ContactService } from '../providers/contact.service';
import { state } from '@angular/animations';
import { AuthService } from '../providers/auth.service';
import { MatMenuTrigger } from '@angular/material';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  messages = [];
  nickname = '';
  userId = ''
  stateO = {
    pseudo: '',
    roomLength: 0,
    name: '',
    connectedUserId: '',
    online: false
  }
  user: any
  photo = ''
  message = {
    userId: '',
    roomId: '',
    text: '',
    pseudo: '',
    messageRepliedId: '',
    isReply: false
  }

  repliedMessage = {
    messageId: '',
    text: '',
    userId: '',
    pseudo: ''
  }

  menu = false
  subscription: Subscription;
  @ViewChild('clickHoverMenuTrigger', null) clickHoverMenuTrigger: MatMenuTrigger
  // used for scrolling the pane
  @ViewChild('scrollMe', null) private myScrollContainer: ElementRef;

  constructor(private navCtrl: NavController,
    private socket: Socket,
    private router: Router,
    private contactService: ContactService,
    private authService: AuthService,
    private clipboard: Clipboard,
    private toastCtrl: ToastController) {
    //this.nickname = this.navParams.data;
    const state = this.router.getCurrentNavigation().extras.state
    console.log(state)
    this.stateO.pseudo = state.pseudo
    this.stateO.name = state.roomName
    this.stateO.roomLength = state.roomLength
    this.stateO.connectedUserId = state.connectedUserId
    this.coonectSocket()
    this.disconnectUserSocket()
    this.getMessagesBySocket().subscribe(message => {
      console.log(message)
      message['roomId'] == state.roomId ? this.messages.push(message) : null
    });
    this.deleteMessageFromSocket()

    /*this.getUsers().subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.showToast('User left: ' + user);
      } else {
        this.showToast('User joined: ' + user);
      }
    });*/
  }

  ngOnInit() {
    const state = this.router.getCurrentNavigation().extras.state
    this.userId = localStorage.getItem('teepzyUserId');
    this.getUser()
    this.message.userId = this.userId
    this.message.pseudo = state.pseudo
    this.message.roomId = state.roomId
    this.photo = state.photo
    console.log(this.photo)
    this.getMessages(state.roomId)
  }

  ionViewDidEnter(){
    this.scrollToBottom();

  }

  replyto(msg) {
    this.message.isReply = true
    this.repliedMessage.pseudo = msg.pseudo;
    this.repliedMessage.text = msg.text;
    this.repliedMessage.userId = msg.userId
    this.repliedMessage.messageId = msg._id
    console.log(this.repliedMessage)

  }

  close() {
    this.message.isReply = false
    this.repliedMessage.pseudo = '';
    this.repliedMessage.text = '';
    this.repliedMessage.userId = ''
    this.repliedMessage.messageId = ''
    console.log(this.repliedMessage)
  }


  sendMessage() {
    if (!this.message.isReply) {
      this.contactService.addMessage(this.message).subscribe(res => {
        console.log(res)
        this.socket.emit('add-message', this.message);
        this.message.text = '';
      }, error => {
        console.log(error)
      })
    } else {
      this.message.pseudo = this.repliedMessage.pseudo
      this.message.messageRepliedId = this.repliedMessage.messageId
      this.contactService.addReplyMessage(this.message).subscribe(res => {
        console.log(res)
        this.socket.emit('add-message', this.message);
        this.message.text = '';
        this.close()
      }, error => {
        console.log(error)
      })
    }

  }



  addMessageToFavorite(messageId) {
    let favoris = {
      userId: this.userId,
      messageId: messageId,
      type: 'MESSAGE'
    }
    this.contactService.addMessageFavorite(favoris).subscribe(res => {
      console.log(res)
      this.showToast('Ajouté aux favoris')
    }, error => {
      this.showToast('Oops! une erreur est survenue')
      console.log(error)
    })
  }

  deleteMessage(messageId) {
    let message = {
      messageId: messageId
    }
    console.log(message)
    this.contactService.deleteMessage(message).subscribe(res => {
      console.log(res)
    }, error => {
      console.log(error)
    })
  }

  coonectSocket() {
    this.socket.connect();
    this.socket.fromEvent('user-online').subscribe(notif => {
      console.log(notif)
      notif['userId'] == this.stateO.connectedUserId ? this.stateO.online = true : null
    });
  }

  disconnectUserSocket() {
    this.socket.connect();
    this.socket.fromEvent('user-outline').subscribe(notif => {
      console.log(notif)
      notif['userId'] == this.stateO.connectedUserId ? this.stateO.online = false : null
    });
  }

  deleteMessageFromSocket() {
    this.socket.connect();
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
    // get index of object with id:37
    let removeIndex = list.map(function (item) { return item.id; }).indexOf(id);
    // remove object
    list.splice(removeIndex, 1);
    return list
  }


  onLongPress() {

  }

  onLongPressing() {
    this.clickHoverMenuTrigger.openMenu();
  }

  getMessages(id) {
    this.contactService.ChatRoomMessages(id).subscribe(res => {
      console.log(res)
      this.messages = res['data']['messages']
    }, error => {
      console.log(error)
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

  getUser() {
    this.authService.myInfos(this.userId).subscribe(res => {
      console.log(res)
      this.user = res['data']

      this.message.pseudo = this.user.pseudoPro
    }, error => {
      console.log(error)
    })
  }

  getUsers() {
    let observable = new Observable(observer => {
      this.socket.on('users-changed', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  copyMessage(text) {
    this.clipboard.copy(text).then(res => {
      this.showToast("message copié")
    });

  }
  ionViewWillLeave() {
    this.socket.disconnect();
    this.subscription ? this.subscription.unsubscribe() : null

  }

  async showToast(msg) {
    const toast = await this.toastCtrl.create({
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
    this.socket.removeAllListeners('message');
    //this.socket.removeAllListeners('users-changed');
  }
}
