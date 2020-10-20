import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactService } from '../providers/contact.service';
import { ToastController, MenuController, ActionSheetController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { MatTabGroup } from '@angular/material';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MESSAGES } from '../constant/constant';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {


  userId = ''
  invitations = []
  invitationsSms = []
  notifications = []
  links = []
  loading = false

  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public selected: number;

  message = 'mon message pour vous';
  messages = [];
  currentUser = '';



  private swipeCoord?: [number, number];
  private swipeTime?: number;

  selectedTab = 0
  subscription: Subscription
  constructor(
    private contactService: ContactService,
    private menuCtrl: MenuController,
    private toastController: ToastController,
    private socket: Socket,
    private router: Router,
    public actionSheetController:ActionSheetController,
    public navCtrl: NavController
  ) {
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
  }



  ngOnInit() {
    this.coonectSocket()
  }


  ionViewWillEnter(){
    this.userId = localStorage.getItem('teepzyUserId');
    this.socket.emit('online', this.userId );
    this.listInvitations()
    this.listLinks()
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
       //   console.log("Swipe left - INDEX: " + this.selectedTab);
        } else if (swipe === 'previous') {
          const isLast = this.selectedTab === 2;
          if (this.selectedTab >= 1) {
            this.selectedTab = this.selectedTab - 1;
          }
         // console.log("Swipe right — INDEX: " + this.selectedTab);
        }
        // Do whatever you want with swipe
      }
    }
  }

  swipe(e: TouchEvent, when: string): void {
  //  console.log('swipe up')
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
    this.socket.fromEvent('user-notification').subscribe(notif => {
    // console.log(notif)
      this.notifications.push(notif)
    //  console.log(this.notifications)
    });
  }


  doRefreshNotification(event) {
  //  console.log('Begin async operation');
    setTimeout(() => {
    //  console.log('Async operation has ended');
      this.listNotifications()
      event.target.complete();
    }, 400);
  }

  doRefreshInvitation(event) {
   // console.log('Begin async operation');
    setTimeout(() => {
     // console.log('Async operation has ended');
      this.listInvitations()
      event.target.complete();
    }, 400);
  }


  goToContacts() {
    this.router.navigate(['/contacts', { previousUrl: 'feeds' }])

  }
  listInvitations() {
    let invitation = {
      idReceiver: this.userId
    }
    this.contactService.listInivtation(invitation).subscribe(res => {
    //  console.log(res)
      this.invitations = res['data']
    }, error => {
    //  console.log(error)

    })
  }

  listLinks() {
    let invitation = {
      idReceiver: this.userId
    }
    this.contactService.listLinksPeople(invitation).subscribe(res => {
     // console.log(res)
      this.links = res['data']
    }, error => {
     // console.log(error)

    })
  }

  listInvitationsViaSms() {
    let invitation = {
      idReceiver: this.userId
    }
    this.contactService.listInivtationViaSms(invitation).subscribe(res => {
     // console.log(res)
      this.invitationsSms = res['data']
    }, error => {
     // console.log(error)

    })
  }

  listNotifications() {
    this.loading = true
    this.contactService.listNotification(this.userId).subscribe(res => {
    //  console.log(res)
      this.notifications = res['data']
      this.loading = false

    }, error => {
     // console.log(error)
      this.loading = false

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
    //  console.log(res)
      this.loading = false
      this.listInvitations()
      this.presentToast('Vous désormais en contact')
    }, error => {
     // console.log(error)
      this.loading = false
    })
  }

  deleteLink(p){
    let invitation = {
      idInvitation: p._id,
    }
    this.contactService.closeLinkPeople(invitation).subscribe(res =>{
     // console.log(res)
      this.presentToast(MESSAGES.LINK_DENIED_OK)
      this.listLinks()
    }, error =>{
     // console.log(error)
      this.presentToast(MESSAGES.SERVER_ERROR)
    })
  }

  refuseLink(p){
    let invitation = {
      idInvitation: p._id,
    }
    this.contactService.refuseLinkPeople(invitation).subscribe(res =>{
     // console.log(res)
      this.presentToast(MESSAGES.LINK_DENIED_OK)
      this.listLinks()
    }, error =>{
     // console.log(error)
      this.presentToast(MESSAGES.SERVER_ERROR)
    
    })
  }

  acceptLink(p){
    let invitation = {
      idInvitation: p._id,
      idReceiver: p.idReceiver, 
      idSender: p.idSender,
      postId: p.postId 
    }
    this.contactService.acceptLinkPeople(invitation).subscribe(res =>{
     // console.log(res)
      this.listLinks()
    this.createChatRoom(p)
    }, error =>{
     // console.log(error)
      
    })
  }



  gotoChatRoom(roomId, pseudo, photo, roomLength, roomName, connectedUserId, roomUserId) {
    this.socket.connect();
    this.navCtrl.navigateForward("/chat", 
    { state: {roomId: roomId,pseudo: pseudo,
       photo: photo, roomLength: roomLength, roomName, connectedUserId: connectedUserId, userId: roomUserId } });
    // this.router.navigateByUrl('/chat')

  }

  createChatRoom(p) {
    this.loading = true
    let chatRoom = {
      name: '',
      connectedUsers: [],
      userId: ''
    }
  
    chatRoom.connectedUsers[0] = p.senderId
    chatRoom.userId = this.userId
    chatRoom.name != '' ? null : chatRoom.name = 'Entre nous deux'
    this.contactService.initChatRoom(chatRoom).subscribe(res => {
      //console.log(res)
      let room = res['data']
      if (res['status'] == 200) {
        this.loading = false
       // console.log(res['status'])
        this.gotoChatRoom(room._id, room.connectedUsersInfo.pseudoIntime, room.connectedUsersInfo.photo, 
          room.connectedUsers.length, room.name, room.connectedUsers[0], room.userId)
      } else {
        this.presentToast(MESSAGES.ROOM_EXIST_OK)
        this.loading = false
      }
    }, error => {
      this.loading = false
      this.presentToast(MESSAGES.SERVER_ERROR)
      //console.log(error)
    })
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }


  goToDetailTeepz(idTeepz) {
    this.router.navigate(['/detail-feed', { idTeepz: idTeepz, previousUrl: 'search' }])
  }

  async presentActionSheet(link) {
    //console.log(link)
    const actionSheet = await this.actionSheetController.create({
      header: link.message,
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Accepter',
          icon: 'checkmark',
          handler: () => {
           this.acceptLink(link)
          }
        },
        {
        text: 'Consulter',
        icon: 'eye',
        handler: () => {
          this.goToDetailTeepz(link.postId)
        }
      },
      {
        text: 'Refuser',
        icon: 'remove-circle',
        handler: () => {
          this.refuseLink(link)
        }
      }
      ,{
        text: 'Annuler',
        icon: 'close',
        role: 'cancel',
        handler: () => {
      //    console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }



  ionViewWillLeave() {
    this.socket.disconnect();
    //console.log('disconnected')
    this.subscription?  this.subscription.unsubscribe() :  null

  }
  ngOnDestroy() { 
    this.subscription?  this.subscription.unsubscribe() :  null
    //this.socket.removeAllListeners('message');
    //this.socket.removeAllListeners('users-changed');
  }

}
