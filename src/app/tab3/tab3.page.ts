import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ModalController, MenuController, ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { ContactService } from '../providers/contact.service';
import { CircleMembersPage } from '../circle-members/circle-members.page';
import { DatapasseService } from '../providers/datapasse.service';
import { Subscription } from 'rxjs';

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
  loading =  false

  constructor(public navCtrl: NavController,
    private router: Router,
    private contactService: ContactService,
    public modalController: ModalController,
    private dataPasse: DatapasseService,
    private menuCtrl: MenuController,
    private toastController: ToastController,
    private socket: Socket) { 
      this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
      this.subscription = this.dataPasse.get().subscribe(list => {
       // console.log(list)
        if (list.length > 0) {
          this.rooms = list
        }
      });
    }

  ngOnInit() {
  }

  ionViewWillEnter(){

    this.userId = localStorage.getItem('teepzyUserId');
    this.socket.emit('online', this.userId );
    this.getUsersOfCircle()
    this.getChatRooms()

  }


  trackByFn(index, item) {
    return index; // or item.id
  }


  joinChat() {
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

  removeRoom(roomId){
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
      //console.log(res);
      this.rooms = res['data']
      this.loading = false
    }, error => {
      //console.log(error)
      this.loading = false
    })
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
    const modal = await this.modalController.create({
      component: CircleMembersPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }


  goToContacts() {
    this.router.navigate(['/contacts', { previousUrl: 'feeds' }])

  }

  goToSearch() {
    this.router.navigateByUrl('/search')
  }

  gotoChatRoom(roomId, pseudo, photo, roomLength, roomName, connectedUserId, userId) {
    //console.log(roomId, pseudo, photo)
    this.socket.connect();
    this.socket.emit('set-nickname', this.nickname);
    this.navCtrl.navigateForward("/chat", 
    { state: { nickname: this.nickname, roomId: roomId,pseudo: pseudo,
       photo: photo, roomLength: roomLength, roomName, connectedUserId: connectedUserId, userId: userId } });
    // this.router.navigateByUrl('/chat')

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
