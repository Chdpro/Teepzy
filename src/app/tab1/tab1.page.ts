import { Component, OnInit, ViewChild, ElementRef, QueryList, Inject } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { ContactService } from '../providers/contact.service';
import { ToastController, AlertController, IonSlides, MenuController, ModalController, IonRouterOutlet, ActionSheetController } from '@ionic/angular';
import * as moment from 'moment';
import { DatapasseService } from '../providers/datapasse.service';
import { Subscription } from 'rxjs';
import { LinkSheetPage } from '../link-sheet/link-sheet.page';
import { CommentsPage } from '../comments/comments.page';
//import { Socket } from 'ngx-socket-io';
import { Router, ActivatedRoute } from '@angular/router';
import { Globals } from '../globals';
import { DomSanitizer } from '@angular/platform-browser';
import { typeAccount, MESSAGES, CACHE_KEYS, Offline } from '../constant/constant';
import { ShareSheetPage } from '../share-sheet/share-sheet.page';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { NetworkService } from '../providers/network.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  user: any
  listPosts = []
  posts = []
  userId = ''
  commentT = {
    userId: '',
    postId: '',
    comment: '',
  }
  commentC = {
    userId: '',
    commentId: '',
    comment: '',
  }
  listComments = []
  listCommentsOfComment = []
  postId = ''
  commentId = ''
  _MS_PER_DAY = 1000 * 60 * 60 * 24;
  showSearch = false
  showResponsePanel = false
  search: any
  timeCall = 0
  repost: any
  publication: any
  linkModal = false
  shareLink = false
  users = []
  loading = false
  video_url = '../../assets/img/test.mp4'
  isPlaying = false
  tutos = []
  showBackground = false
  global: Globals;
  subscription: Subscription;

  navigationSubscription;
  @ViewChild('videoPlayer', null) videoPlayers: ElementRef;
  @ViewChild('slides', null) ionSlides: IonSlides;
  @ViewChild(IonSlides, null) slides: IonSlides;

  currentPlaying = null
  currentIndex: Number = 0;

  disablePrevBtn = true;
  disableNextBtn = false;

  isTutoSkip = ""

  activeIndex = 0;
  data;

  api: VgApiService;

  videoMuted = ''
  videoUrl =''

  constructor(
    private authService: AuthService,
    private toasterController: ToastController,
    private dataPass: DatapasseService,
    public alertController: AlertController,
    private menuCtrl: MenuController,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private router: Router,
    private networkService: NetworkService,
    public globals: Globals,
    public sanitizer: DomSanitizer,
    public actionSheetController: ActionSheetController,
    private contactService: ContactService
    ) {
    this.menuCtrl.enable(true, 'first');
    this.menuCtrl.swipeGesture(false);
    this.global = globals;
    this.subscription = this.dataPass.getPosts().subscribe(post => {
      // console.log(list)
      if (post) {
        this.listPosts.push(post)
      }
    //  console.log(this.listPosts)
      this.listPosts = this.listPosts.sort((a, b) => {
        return parseInt(b.dateTimeStamp) - parseInt(a.dateTimeStamp)
       })
    });
  }

  ngOnInit() {
 
  }

  


  ionViewWillEnter() {
    this.connectSocket()
    this.userId = localStorage.getItem('teepzyUserId');
 //   this.socket.emit('online', this.userId);
    this.getUserInfo(this.userId)
    if (this.networkService.networkStatus() === Offline) {
    this.getFeedFromLocal()      
    } else {
      this.getFeedFromLocal()
      this.getPosts(this.userId)
    }
    this.isTutoSkip = localStorage.getItem("isTutoSkip")
 
  }
  ngAfterViewInit() {
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  skipTuto() {
    let iSskip = "YES"
    localStorage.setItem('isTutoSkip', iSskip)
    this.tutos = []
    this.isTutoSkip = localStorage.getItem("isTutoSkip")
  }

  doCheck() {
    let prom1 = this.ionSlides.isBeginning();
    let prom2 = this.ionSlides.isEnd();

    Promise.all([prom1, prom2]).then((data) => {
      data[0] ? this.disablePrevBtn = true : this.disablePrevBtn = false;
      data[1] ? this.disableNextBtn = true : this.disableNextBtn = false;
    });
  }


  swipeEvents(event) {
    ///console.log('swipe');
    this.listPosts.length == 0 ? this.getPosts(this.userId) : null
  }

  
  connectSocket() {
    /*this.socket.connect();
    this.socket.fromEvent('user-notification').subscribe(notif => {
      //   console.log(notif)
    });*/
  }



  tutosTexts() {
    this.contactService.tutotxts().subscribe(res => {
      this.tutos = res
      //  console.log(this.tutos)
    })
  }

  swipeLeft(event: any): any {
    // console.log('Swipe Left', event);
    this.stopVideo()
  }

  swipeRight(event: any): any {
    // console.log('Swipe Right', event);
    this.stopVideo()

  }



  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
    if (this.globals.showBackground) {
      this.globals.showBackground = false;
    } else {
      this.globals.showBackground = true;
    }
  }


  getSlideIndex() {
    // console.log(this.isElementInViewPort(this.videoPlayers.nativeElement))
    this.slides.getActiveIndex().then(
      (index) => {
        this.currentIndex = index;
        //   console.log(this.currentIndex)
      });
  }

  public next() {
    this.slides.slideNext();
    this.stopVideo()

  }

  public swipeNext() {
    this.slides.slideNext();
  }

  public swipePrev() {
    this.slides.slidePrev();
  }


  public prev() {
    this.slides.slidePrev();
    this.stopVideo()

  }

  dismissShareSheet() {
    if (this.shareLink) {
      this.shareLink = false
    } else {
      this.shareLink = true
    }
  }


  stopVideo() {
    if (this.videoPlayers) {
     // console.log(this.videoPlayers)
      const nativeElement = this.videoPlayers.nativeElement;
      this.currentPlaying = nativeElement;
      this.currentPlaying.muted = true;
      this.currentPlaying.pause();
      this.currentPlaying = null
    }

  }

  unMute(){
      const nativeElement = this.videoPlayers.nativeElement;
      if (!this.isElementInViewPort(nativeElement)) {
        this.videoMuted = ''
        this.videoPlayers.nativeElement.pause()
      }
      
    
  //  this.onPlayerPause(this.api)

  }

  swipeEvent(event?: Event, videoUrl?: any) {
    if (videoUrl) {
    this.videoPlayers.nativeElement = document.getElementById(videoUrl)
    const nativeElement = this.videoPlayers.nativeElement
    nativeElement.pause() 
    }
   // this.onPlayerPause(this.api)
  //  const nativeElement = this.videoPlayers.nativeElement;
  //  console.log(this.isElementInViewPort(nativeElement))
  //  if (this.isElementInViewPort(nativeElement)) {
  //   this.videoMuted = ''
  //   this.videoPlayers.nativeElement.pause()
  // }
  }


  isElementInViewPort(el) {
    const rect = el.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
  }

  showShareSheet(post) {
    if (post) {
      this.repost = {
        postId: post['_id'],
        fromId: post['userId'],
        reposterId: this.userId,
        userPhoto_url: post['userPhoto_url'],
        userPseudo: post['userPseudo'],
        content: post['content'],
        image_url: post['image_url'],
        backgroundColor: post['backgroundColor'],
        includedCircles: post['includedCircles']
      }
    }

    if (this.shareLink) {
      this.shareLink = false
    } else {
      this.shareLink = true
    }

  }


  doRefresh(event) {
    //console.log('Begin async operation');
    setTimeout(() => {
      // console.log('Async operation has ended');
      this.getPosts(this.userId)
      event.target.complete();
    }, 400);
  }



  trackByFn(index, item) {
    return index; // or item.id
  }


  videoPlayerInit(data) {
    this.data = data;

    this.data.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.initVdo.bind(this));
    //this.data.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));
  }

  onPlayerReady(api: VgApiService) {
    this.api = api;
    this.api.getDefaultMedia().subscriptions.ended.subscribe(
      () => {
          // Set the video to the beginning
          this.api.getDefaultMedia().currentTime = 0;
          console.log(this.api.getDefaultMedia().currentTime)

      }
  );
}

onPlayerPause(api: VgApiService) {
  this.api = api;
  this.api.getDefaultMedia().subscriptions.ended.subscribe(
    () => {
        // Set the video to the beginning
        this.api.getDefaultMedia().currentTime = 0;
    }
);
}
  

  initVdo() {
    this.data.play();
  }

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
      //  console.log(res)
      this.user = res['data'];
    }, error => {
      // console.log(error)
    })
  }


  goToContacts() {
    this.router.navigate(['/contacts', { previousUrl: 'feeds' }])

  }

  goToSearch() {
    this.router.navigateByUrl('/search')

  }





  addFavorite(postId) {
    console.log(postId)
    let favoris = {
      userId: this.userId,
      postId: postId,
      type: 'POST'
    }
    this.contactService.addFavorite(favoris).subscribe(res => {
    //  this.socket.emit('notification', 'notification');
      //   console.log(res)
      this.listPosts.find((c, index) => c['_id'] == postId ? c['favorite'] = true : null)
      this.presentToast('Ajouté aux favoris')
    }, error => {
      this.presentToast('Oops! une erreur est survenue')
      // console.log(error)
    })
  }

  removeFavorite(postId) {
    let favoris = {
      userId: this.userId,
      postId: postId
    }
    this.contactService.removeFavorite(favoris).subscribe(res => {
      //  console.log(res)
      this.listPosts.find((c, index) => c['_id'] == postId ? c['favorite'] = false : null)
      this.presentToast(MESSAGES.REMOVE_FAVORITE_OK)
    }, error => {
      this.presentToast(MESSAGES.SERVER_ERROR)
      //  console.log(error)
    })
  }


  goToProfile(userId, reposterId) {
    console.log(userId, reposterId)
    if (this.userId === userId || this.userId === reposterId) {
      this.router.navigate(['/tabs/profile', { userId: userId || reposterId }])
    } else {
      this.router.navigate(['/profile', { userId: userId || reposterId , previousUrl: 'feed' }])
    }

  }

  async presentLinkModal(post, typeMatch) {
    if (this.globals.showBackground) {
      this.globals.showBackground = false;
    } else {
      this.globals.showBackground = true;
    }
    const modal = await this.modalController.create({
      component: LinkSheetPage,
      componentProps: { post: post, typeMatch: typeMatch },
      backdropDismiss: false,
      showBackdrop: true,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });
    return await modal.present();
  }


  async presentShareModal(post) {
    if (this.globals.showBackground) {
      this.globals.showBackground = false;
    } else {
      this.globals.showBackground = true;
    }
    const modal = await this.modalController.create({
      component: ShareSheetPage,
      componentProps: post,
      cssClass: 'share-custom-class',
      backdropDismiss: false,
      showBackdrop: true,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });
    return await modal.present();
  }

  async presentCommentModal(post) {
    if (this.globals.showBackground) {
      this.globals.showBackground = false;
    } else {
      this.globals.showBackground = true;
    }
    const modal = await this.modalController.create({
      component: CommentsPage,
      componentProps: post,
      backdropDismiss: false,
      cssClass: 'comment-class',
      showBackdrop: true,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });
    return await modal.present();
  }

  pauseOrPlay(video){
    video.pause();
}

  getPosts(userId) {
    this.timeCall = 1
    this.loading = true
    this.contactService.getPosts(userId).subscribe(res => {
      this.listPosts = []
      if (res['data'] != null) {
        this.listPosts = res['data']
        console.log(this.listPosts)
        this.listPosts = this.listPosts.sort((a, b) => {
        return parseInt(b.dateTimeStamp) - parseInt(a.dateTimeStamp)
       })

      this.contactService.setLocalData(CACHE_KEYS.FEEDS_CHECK, this.listPosts)
      } else {
        this.listPosts = []
        this.tutosTexts()
      }
      this.loading = false
      this.timeCall = 0
    }, error => {
      this.loading = false
       console.log(error)
      
    })
  }

  getFeedFromLocal(){
    this.contactService.feedsFromLocal().subscribe(listPosts =>{
      this.listPosts = listPosts
      console.log(this.listPosts)
    })
  }

  time(date) {
    moment.locale('fr');
    return moment(date).fromNow()
  }



  // checkFavorite(favorite, e) {
  //   this.contactService.checkFavorite(favorite).subscribe(res => {
  //     if (res['status'] == 201) {
  //       let dateStamp = e['createdAt'].slice(0,10).split('-').join('')
  //       let timeStamp = e['createdAt'].slice(11,19).split(':').join('')
  //       this.listPosts.push(
  //         {
  //           _id: e['_id'],
  //           userId: e['userId'],
  //           userPhoto_url: e['userPhoto_url'],
  //           userPseudo: e['userPseudo'],
  //           content: e['content'],
  //           image_url: e['image_url'],
  //           video_url: e['video_url'],
  //           backgroundColor: e['backgroundColor'],
  //           includedUsers: e['includedUsers'],
  //           createdAt: e['createdAt'],
  //           reposterId: e['reposterId'],
  //           matches: e['matches'],
  //           nbrComments: e['nbrComments'],
  //           favorite: true,
  //           favoriteCount:e['favoriteCount'],
  //           repostCounts: e['repostCounts'],
  //           dateTimeStamp: dateStamp + timeStamp
  //         },
  //       )

  //     } else {
  //       let dateStamp = e['createdAt'].slice(0,10).split('-').join('')
  //       let timeStamp = e['createdAt'].slice(11,19).split(':').join('')

  //       this.listPosts.push(
  //         {
  //           _id: e['_id'],
  //           userId: e['userId'],
  //           userPhoto_url: e['userPhoto_url'],
  //           userPseudo: e['userPseudo'],
  //           content: e['content'],
  //           image_url: e['image_url'],
  //           video_url: e['video_url'],
  //           backgroundColor: e['backgroundColor'],
  //           includedUsers: e['includedUsers'],
  //           createdAt: e['createdAt'],
  //           reposterId: e['reposterId'],
  //           matches: e['matches'],
  //           nbrComments: e['nbrComments'],
  //           favorite: false,
  //           favoriteCount: e['favoriteCount'],
  //           repostCounts: e['repostCounts'],
  //           dateTimeStamp: dateStamp + timeStamp

  //         },
  //       )
  //     }

  //     this.listPosts = this.listPosts.sort((a, b) => {
  //       return b.dateTimeStamp - a.dateTimeStamp
  //     })

  //     this.contactService.setLocalData(CACHE_KEYS.FEEDS_CHECK, this.listPosts)
  //   }, error =>{
  //   })
  // }


  async changePseudo() {
    const actionSheet = await this.actionSheetController.create({
      header: "Changer de compte",
      buttons: [{
        text: '@' + this.user.pseudoPro,
        handler: () => {
          // this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          this.changeAccount(typeAccount.pseudoPro)
        }
      },
      {
        text: '@' + this.user.pseudoIntime,
        handler: () => {
          // this.pickVideo(this.camera.PictureSourceType.PHOTOLIBRARY);
          this.changeAccount(typeAccount.pseudoIntime)
        }
      },

      {
        text: 'Annuler',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }


  changeAccount(typeAccount) {
    let change = {
      typeCircle: typeAccount,
      userId: this.userId
    }
    this.contactService.changeAccount(change).subscribe(res => {
      //   console.log(res)
      this.presentToast('compte changé')
      this.getUserInfo(this.userId)
    }, error => {
      // console.log(error)
    })
  }

  showLinkModal(p) {
    this.publication = p
    if (this.linkModal) {
      this.linkModal = false
    } else {
      this.linkModal = true
    }
  }


  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

}
