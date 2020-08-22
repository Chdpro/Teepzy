import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NavController, NavParams, ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { ContactService } from '../providers/contact.service';
import { state } from '@angular/animations';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  messages = [];
  nickname = '';
  userId = ''
  pseudo = ''
  user:any
  photo = ''
  message = {
    userId: '',
    roomId: '',
    text: '',
    pseudo: ''
  }

  constructor(private navCtrl: NavController,
    private socket: Socket,
    private router: Router,
    private contactService: ContactService,
    private authService: AuthService,
    private toastCtrl: ToastController) {
    //this.nickname = this.navParams.data;
    const state = this.router.getCurrentNavigation().extras.state
    console.log(state)
    this.pseudo = state.pseudo
    this.getMessagesBySocket().subscribe(message => {
      this.messages.push(message);
      console.log(message)
    });

    this.getUsers().subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.showToast('User left: ' + user);
      } else {
        this.showToast('User joined: ' + user);
      }
    });
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

  sendMessage() {
    this.contactService.addMessage(this.message).subscribe(res => {
      console.log(res)
     // this.getMessages(this.message.roomId)
      this.socket.emit('add-message',  this.message );
      this.message.text = '';
    }, error => {
      console.log(error)
    })
  }

  getMessages(id) {
    this.contactService.ChatRoomMessages(id).subscribe(res => {
      console.log(res)
      this.messages = res['data']['messages']
    }, error => {
      console.log(error)
    })

  }

  getMessagesBySocket(){
     let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  getUser(){
    this.authService.myInfos(this.userId).subscribe(res =>{
      console.log(res)
      this.user = res['data']
      
      this.message.pseudo = this.user.pseudoPro
    }, error =>{
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

  ionViewWillLeave() {
    this.socket.disconnect();
  }

  async showToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }


}
