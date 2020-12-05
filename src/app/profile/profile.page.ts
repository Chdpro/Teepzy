import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AddProjectPage } from '../add-project/add-project.page';
import { ModalController, MenuController } from '@ionic/angular';
import { AuthService } from '../providers/auth.service';
import { DatapasseService } from '../providers/datapasse.service';
import { Subscription } from 'rxjs';
import { AddProductPage } from '../add-product/add-product.page';
import { IonSlides } from '@ionic/angular';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { ContactService } from '../providers/contact.service';
import * as moment from 'moment';
import { Socket } from 'ngx-socket-io';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  animations: [
    trigger('slideIn', [
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition('* => void', [
        style({ height: '*' }),
        animate(250, style({ height: 0 }))
      ]),
      transition('void => *', [
        style({ height: '0' }),
        animate(250, style({ height: '*' }))
      ])
    ]),
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('800ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('800ms', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]
    )
  ],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: any
  relationsCount = 0

  pageEvent:any
  slideOpts = {
    initialSlide: 1,
    slidesPerView: 3,
    speed: 400,
  };

  isProProfile = true
  subscription: Subscription;
  subscription2: Subscription;
  subscriptionFavorites: Subscription;
  subscriptionMyTeepz: Subscription;
  subscriptionMyInfo: Subscription;



  listProjects = []
  listProducts = []

  listTeepz = []
  listFavorites = []

  @ViewChild('slides', null) ionSlides: IonSlides;

  disablePrevBtn = true;
  disableNextBtn = true;

  private swipeCoord?: [number, number];
  private swipeTime?: number;
  selectedTab = 0

  pageIndex: number = 0;
  pageSize: number = 4;
  lowValue: number = 0;
  highValue: number = 4;

  previousUrl = ''
  isMyProfile = false

  constructor(private router: Router, private modalController: ModalController,
    private dataPass: DatapasseService,
    private contactService: ContactService,
    private socket: Socket,
    private menuCtrl: MenuController,
    public sanitizer: DomSanitizer,
    public route: ActivatedRoute,
    private authService: AuthService) {
      this.menuCtrl.close('first');
      this.menuCtrl.swipeGesture(false);
            
    this.subscription = this.dataPass.getProjects().subscribe(list => {
      if (list.length > 0) {
        this.listProjects = list
      }
    });
    this.subscription = this.dataPass.get().subscribe(u => {
      if (u) {
        this.user = u
      }
    });
    this.subscription2 = this.dataPass.getProducts().subscribe(list => {
      //console.log(list)
      if (list.length > 0) {
        this.listProducts = list
      }
    });

    this.subscriptionFavorites = this.dataPass.getFavorite().subscribe(list => {
      //console.log(list)
      if (list.length > 0) {
        this.listFavorites = list
      }
    });

    this.subscriptionMyTeepz = this.dataPass.getPosts().subscribe(list => {
      //console.log(list)
      if (list.length > 0) {
        this.listTeepz = list
      }
    });

    
  }

  ngOnInit() {

  }

  ionViewWillEnter(){
    let userId = localStorage.getItem('teepzyUserId')
    this.socket.emit('online', userId );
    let idUser = this.route.snapshot.paramMap.get('userId')
    this.previousUrl = this.route.snapshot.paramMap.get('previousUrl')
    //console.log(this.previousUrl)
    if (!idUser) {
      this.getUserInfo(userId)
      this.getMyPosts(userId)
      this.getMyFavoritePosts(userId)
      this.isMyProfile = true
    }else{
      this.getUserInfo(idUser)
      this.getMyPosts(idUser)
      this.getMyFavoritePosts(idUser)
      this.isMyProfile = false

    }
   
  }

  goToDetailProject(project){
    this.router.navigate(['/detail-project',project])

  }

  goToDetailProduct(product){
    this.router.navigate(['/detail-produit',product])

  }

  time(date) {
    moment.locale('fr');
    return moment(date).fromNow()
  }


  goToDetailMesTeepz(idTeepz) {
    this.router.navigate(['/detail-feed', { idTeepz: idTeepz, previousUrl: 'mesTeepz', previousBackUrl: this.previousUrl }])
    
  }
  goToDetailTeepz(idTeepz) {
    this.router.navigate(['/detail-feed', { idTeepz: idTeepz, previousUrl: 'mesFavorite' }])
    
  }


  goToMembers(){
    if (this.previousUrl == 'feed') {
    this.router.navigate(['/friends', { previousUrl: 'feed',idUser: this.route.snapshot.paramMap.get('userId')  }])
    } else {
    this.router.navigate(['/friends'])
      
    }
  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  getPaginatorData(event) {
    //console.log(event);
    if (event.pageIndex === this.pageIndex + 1) {
      this.lowValue = this.lowValue + this.pageSize;
      this.highValue = this.highValue + this.pageSize;
    }
    else if (event.pageIndex === this.pageIndex - 1) {
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue = this.highValue - this.pageSize;
    }
    this.pageIndex = event.pageIndex;
  }

  next() {
    if (this.user.socialsPro.length <= 3) {
      this.ionSlides.lockSwipes(true)
    } else if (this.user.socialsAmical.length <= 3) {
      this.ionSlides.lockSwipes(true)
    } else {
      this.ionSlides.lockSwipes(false)
      this.ionSlides.slideNext()
      this.ionSlides.lockSwipes(true)
    }
  }


  prev() {
    if (this.user.socialsPro.length <= 3) {
      this.ionSlides.lockSwipes(true)
    } else if (this.user.socialsAmical.length <= 3) {
      this.ionSlides.lockSwipes(true)
    } else {
      this.ionSlides.lockSwipes(false)
      this.ionSlides.slidePrev()
      this.ionSlides.lockSwipes(true)
    }
  }

  goToEdit() {
    this.router.navigate(['/edit-profile'])
  }

  swipe(e: TouchEvent, when: string): void {
    this.switchProfile()
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
      //    console.log("Swipe left - INDEX: " + this.selectedTab);
        } else if (swipe === 'previous') {
          const isLast = this.selectedTab === 4;
          if (this.selectedTab >= 1) {
            this.selectedTab = this.selectedTab - 1;
          }
        //  console.log("Swipe right — INDEX: " + this.selectedTab);
        }
        // Do whatever you want with swipe
      }
    }
  }

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
     // console.log(res)
      this.user = res['data'];
      this.listProjects = res['projects']
      this.listProducts = res['products']
      this.relationsCount = res['relationsCount']
    }, error => {
     // console.log(error)
    })
  }

  getMyPosts(userId) {
    this.contactService.teepZ(userId).subscribe(res => {
     // console.log(res)
      this.listTeepz = res['data'];
    }, error => {
     // console.log(error)
    })
  }


  getMyFavoritePosts(userId) {
    this.contactService.favorites(userId).subscribe(res => {
     // console.log(res)
      this.listFavorites = res['data'];
    }, error => {
     // console.log(error)
    })
  }


  doRefresh(event) {
    //console.log('Begin async operation');
    setTimeout(() => {
      //console.log('Async operation has ended');
      let userId = localStorage.getItem('teepzyUserId')
      this.getUserInfo(userId)
      this.getMyFavoritePosts(userId)
      this.getMyPosts(userId)
      event.target.complete();
    }, 400);
  }

  doCheck() {
    let prom1 = this.ionSlides.isBeginning();
    let prom2 = this.ionSlides.isEnd();
    Promise.all([prom1, prom2]).then((data) => {
      data[0] ? this.disablePrevBtn = true : this.disablePrevBtn = false;
      data[1] ? this.disableNextBtn = true : this.disableNextBtn = false;
    });
  }

  switchProfile() {
    if (this.isProProfile == true) {
      this.isProProfile = false
    } else {
      this.isProProfile = true
    }
  }


  async presentAddProductModal() {
    const modal = await this.modalController.create({
      component: AddProductPage,
      cssClass: 'add-project-class'
    });
    return await modal.present();
  }


  async presentAddProjectModal() {
    const modal = await this.modalController.create({
      component: AddProjectPage,
      cssClass: 'add-project-class'

    });
    return await modal.present();
  }

}
