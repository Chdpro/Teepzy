import { Component, OnInit } from '@angular/core';
import { ContactService } from '../providers/contact.service';
import * as moment from 'moment';
import { ToastController, AlertController, MenuController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { typeAccount, MESSAGES } from '../constant/constant';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  
  private swipeCoord?: [number, number];
  private swipeTime?: number;
  selectedTab = 0

  search = {
    searchValue: '',
    userId:''
  }

  listTeepZrs = []
  users = []
  usersNotInCircles = []
  projects = []
  products = []
  posts = []

  listTeepzrsToInvite = []
  loading = false

  showModal =  false

  pageIndexT: number = 0;
  pageSizeT: number = 5;
  lowValueT: number = 0;
  highValueT: number = 5;

  options: string[] = ['One', 'Two', 'Three'];


  constructor(private contactService: ContactService,
    public toastController: ToastController,
    private socket: Socket,
    private alertController: AlertController,
    private router: Router,
    public sanitizer: DomSanitizer,
    private menuCtrl: MenuController
    ) { 
      this.menuCtrl.close('first');
      this.menuCtrl.swipeGesture(false);
    }

  ngOnInit() {
    this.search.userId = localStorage.getItem('teepzyUserId');
    this.socket.emit('online', this.search.userId );
    this.getPosts()
    this.getTeepzr()
  }

  time(date) {
    moment.locale('fr');
    return moment(date).fromNow()
  }

  connectSocket() {
    this.socket.connect();
  }



  goToDetailTeepz(idTeepz) {
    this.router.navigate(['/detail-feed', { idTeepz: idTeepz, previousUrl: 'search' }])
  }

  getPaginatorDataTeepzr(event) {
    console.log(event);
    if (event.pageIndex === this.pageIndexT + 1) {
      this.lowValueT = this.lowValueT + this.pageSizeT;
      this.highValueT = this.highValueT + this.pageSizeT;
    }
    else if (event.pageIndex === this.pageIndexT - 1) {
      this.lowValueT = this.lowValueT - this.pageSizeT;
      this.highValueT = this.highValueT - this.pageSizeT;
    }
    this.pageIndexT = event.pageIndex;
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
          if (this.selectedTab <= 4) {
            this.selectedTab = isFirst ? 1 : this.selectedTab + 1;
          }
          console.log("Swipe left - INDEX: " + this.selectedTab);
        } else if (swipe === 'previous') {
          const isLast = this.selectedTab === 4;
          if (this.selectedTab >= 1) {
            this.selectedTab = this.selectedTab - 1;
          }
          console.log("Swipe right — INDEX: " + this.selectedTab);
        }
        // Do whatever you want with swipe
      }
    }
  }

  getPosts(){
    this.contactService.getPosts(this.search.userId).subscribe(res =>{
      //console.log(res)
      this.posts = res['data'];
    }, error =>{
      console.log(error)
    })
  }



  dismissConfirmModal(){
    if (this.showModal) {
      this.showModal = false
    } else {
      this.showModal = true
    }
  
  }

  checkAvailability(arr, val) {
    return arr.some(function(arrVal) {
        return val === arrVal['_id'];
    });
}

  searchUsersNotInMyCircle(){
    this.loading = true
    this.contactService.searchTeepZrs(this.search).subscribe(res =>{
      this.loading = false
      this.usersNotInCircles = res['users']
      console.log(this.usersNotInCircles)
      this.usersNotInCircles.forEach(e => {
        let invitation = { idSender: this.search.userId, idReceiver: e['_id'] }
        this.contactService.checkInvitationTeepzr(invitation).subscribe(res => {
          if (res['status'] == 201) {
            this.checkAvailability(this.listTeepzrsToInvite, e['_id']) ? null :  this.listTeepzrsToInvite.push({ _id: e['_id'], nom: e['nom'], prenom: e['prenom'], phone: e['phone'], photo: e['photo'],  pseudoIntime: e['pseudoIntime'], circleMembersCount: e['circleMembersCount'], invited: true }) 
          } else {
            console.log(this.listTeepzrsToInvite)
            this.checkAvailability(this.listTeepzrsToInvite, e['_id']) ? null : this.listTeepzrsToInvite.push({ _id: e['_id'], nom: e['nom'], prenom: e['prenom'], phone: e['phone'], photo: e['photo'],  pseudoIntime: e['pseudoIntime'], circleMembersCount: e['circleMembersCount'], invited: false })
          }
        })
      });
    }, error =>{
      console.log(error)
      this.loading = false
    })
  }
  

  getTeepzr() {
    this.contactService.teepZrs(this.search.userId).subscribe(res => {
      console.log(res)
      this.listTeepZrs = res['data']
    }, error => {
      console.log(error)

    })
  }


  goToDetailProject(project){
    this.router.navigate(['/detail-project',project])

  }

  goToDetailProduct(product){
    this.router.navigate(['/detail-produit',product])

  }
  
  searchOnMatches(){
    this.loading = true
    this.contactService.SearchOnMatch(this.search).subscribe(res =>{
      console.log(res);
      this.loading = false
      //this.users = res['users']
      this.products = res['products']
      this.projects = res['projects']
      this.posts = res['posts']
    }, error =>{
      this.loading = false
      console.log(error)
    })

    this.contactService.SearchInCircleOnMatch(this.search).subscribe(res =>{
      console.log(res);
      this.loading = false
      this.users = res['users']
    }, error =>{
      this.loading = false
      console.log(error)
    })
  }


  searchOn(){
    this.searchUsersNotInMyCircle()
    this.searchOnMatches()
    this.getPosts()
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }




  sendInvitationToJoinCircle(idReceiver) {
    console.log(idReceiver)
    this.loading = true
    let invitation = {
      idSender: this.search.userId,
      idReceiver: idReceiver,
      typeLink: typeAccount.pseudoIntime
    }
    this.contactService.inviteToJoinCircle(invitation).subscribe(res => {
      console.log(res)
      this.listTeepzrsToInvite.find((c, index) => c['_id'] == idReceiver ? c['invited'] = true : null)
      this.presentToast(MESSAGES.INVITATION_SEND_OK)
      this.showModal = false
      this.socket.emit('notification', 'notification');
      console.log(this.listTeepzrsToInvite)
      this.loading = false
    }, error => {
      this.presentToast(MESSAGES.INVITATION_SEND_ERROR)
      this.loading = false
      this.showModal = false


    })
  }


  cancelInvitationToJoinCircle(u) {
    this.loading = true
    let invitation = {
      idSender: this.search.userId,
      idReceiver: u._id,
    }

    this.contactService.cancelToJoinCircle(invitation).subscribe(res => {
      if (res['status'] == 400) {
        this.presentToast(MESSAGES.INVITATION_SEND_ERROR)
        this.loading = false

      } else {
        this.listTeepzrsToInvite.find((c, index) => c['_id'] == u._id ? c['invited'] = false : null)
        console.log(this.listTeepzrsToInvite)
        this.presentToast('Invitation annulée')
        this.loading = false

      }
      //  this.getTeepzr()
    }, error => {
      this.presentToast(MESSAGES.INVITATION_SEND_ERROR)
      this.loading = false

    })
  }





}
