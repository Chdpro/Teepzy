import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
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

  constructor(public navCtrl: NavController,
    private router: Router,
    private contactService: ContactService,
    public modalController: ModalController,
    private dataPasse: DatapasseService,
    private socket: Socket) { 

      this.subscription = this.dataPasse.getPosts().subscribe(list => {
        if (list.length > 0) {
          this.rooms = list
        }
      });
    }

  ngOnInit() {
  }

  ionViewWillEnter(){

    this.userId = localStorage.getItem('teepzyUserId');

    this.getUsersOfCircle()
    this.getChatRooms()

  }


  trackByFn(index, item) {
    return index; // or item.id
  }


  joinChat() {
  }

  

  getUsersOfCircle() {
    this.contactService.getCircleMembers(this.userId).subscribe(res => {
      console.log(res);
      this.members = res['data']
    }, error => {
      console.log(error)
    })
  }

  getTheOtherUser(){
    
  }

  getChatRooms() {
    this.contactService.mChatRooms(this.userId).subscribe(res => {
      console.log(res);
      this.rooms = res['data']
    }, error => {
      console.log(error)
    })
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

  gotoChatRoom(roomId, pseudo, photo) {
    this.socket.connect();
    this.socket.emit('set-nickname', this.nickname);
    this.navCtrl.navigateForward("/chat", 
    { state: { nickname: this.nickname, roomId: roomId,pseudo: pseudo, photo: photo } });
    // this.router.navigateByUrl('/chat')

  }
}
