import { Component, OnInit, ViewChild, ElementRef, QueryList } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { ContactService } from '../providers/contact.service';
import { ToastController, AlertController, IonSlides, MenuController, ModalController, IonRouterOutlet, ActionSheetController } from '@ionic/angular';
import * as moment from 'moment';
import { DatapasseService } from '../providers/datapasse.service';
import { Subscription } from 'rxjs';
import { LinkSheetPage } from '../link-sheet/link-sheet.page';
import { CommentsPage } from '../comments/comments.page';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { Globals } from '../globals';
import { DomSanitizer } from '@angular/platform-browser';
import { typeAccount, MESSAGES } from '../constant/constant';
import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { ShareSheetPage } from '../share-sheet/share-sheet.page';


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

  search = ''
  subscription: Subscription;
  timeCall = 0

  repost: any

  publication: any
  linkModal = false
  shareLink = false

  users = []

  loading = false

  video_url = '../../assets/img/test.mp4'
  isPlaying = false
  slideOpts = {
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.params = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { slides } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = swiper.slides.eq(i);
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          let tx = -offset$$1;
          if (!swiper.params.virtualTranslate) tx -= swiper.translate;
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
          }
          const slideOpacity = swiper.params.fadeEffect.crossFade
            ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
            : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
          $slideEl
            .css({
              opacity: slideOpacity,
            })
            .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, $wrapperEl } = swiper;
        slides.transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          slides.transitionEnd(() => {
            if (eventTriggered) return;
            if (!swiper || swiper.destroyed) return;
            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      },
    }
  }


  showBackground = false
  global: Globals;

  @ViewChild(IonSlides, null) slides: IonSlides;

  navigationSubscription;

  @ViewChild('videoPlayer', null) videoPlayers: ElementRef;

  currentPlaying = null

  currentIndex: Number = 0;


  constructor(private authService: AuthService,
    private toasterController: ToastController,
    private dataPass: DatapasseService,
    public alertController: AlertController,
    private menuCtrl: MenuController,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private socket: Socket,
    private router: Router,
    private globals: Globals,
    public sanitizer: DomSanitizer,
    public actionSheetController: ActionSheetController,
    private videoPlayer: VideoPlayer,
    private contactService: ContactService) {
    this.menuCtrl.enable(true, 'first');
    this.menuCtrl.swipeGesture(true);
    this.global = globals;
    this.subscription = this.dataPass.getPosts().subscribe(list => {
     // console.log(list)
      if (list.length > 0) {
        this.listPosts = list
      }
    });
  }

  ngOnInit() {
    this.connectSocket()
  }

  ionViewWillEnter() {
    this.userId = localStorage.getItem('teepzyUserId');
    this.socket.emit('online', this.userId);
    this.getUserInfo(this.userId)
    this.getPosts(this.userId)
  //  console.log(this.dataPass.get())
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }


  connectSocket() {
    this.socket.connect();
    this.socket.fromEvent('user-notification').subscribe(notif => {
   //   console.log(notif)
    });
  }



  swipeAll(event: any): any {
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

  nextWhenVideo(){
    if (this.videoPlayers) {
      this.playVideo()
      }else{
        this.slides.slideNext();
        //this.stopVideo()
      }
 
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

  playVideo(videoUrl?: any) {
    let nativeElement
    if (this.videoPlayers) {
      nativeElement = this.videoPlayers.nativeElement
      // const inView = this.isElementInViewPort(nativeElement);
      if (videoUrl) {
        this.currentPlaying = nativeElement;
        this.currentPlaying.muted = false;
        this.currentPlaying.play();
      } else {
        this.currentPlaying = nativeElement;
        this.currentPlaying.muted = true;
        this.currentPlaying.pause();
      }
    }

  }

  stopVideo() {
    if (this.videoPlayers) {
      const nativeElement = this.videoPlayers.nativeElement;
      this.currentPlaying = nativeElement;
      this.currentPlaying.muted = true;
      this.currentPlaying.pause();
      this.currentPlaying = null
    }

  }


  swipeEvent(event?: Event, videoUrl?: any) {
   // console.log(videoUrl)
    this.playVideo()
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
 //   console.log(postId)
    let favoris = {
      userId: this.userId,
      postId: postId,
      type: 'POST'
    }
    this.contactService.addFavorite(favoris).subscribe(res => {
      this.socket.emit('notification', 'notification');
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


  goToProfile(userId){
    if (this.userId === userId) {
    this.router.navigate(['/tabs/profile', { userId: userId }])
    } else {
    this.router.navigate(['/profile', { userId: userId, previousUrl: 'feed' }])
    }

  }

  async presentLinkModal(post) {
    if (this.globals.showBackground) {
      this.globals.showBackground = false;
    } else {
      this.globals.showBackground = true;
    }
    const modal = await this.modalController.create({
      component: LinkSheetPage,
      componentProps: post,
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
      showBackdrop: true,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });
    return await modal.present();
  }


  getPosts(userId) {
    this.timeCall = 1
    this.loading = true
    this.contactService.getPosts(userId).subscribe(res => {
      this.listPosts = []
      if (res['data'] != null) {
        this.posts = res['data']
        this.posts.forEach(e => {
          let favorite = {
            userId: this.userId,
            postId: e['_id'],
          }
          this.checkFavorite(favorite, e)
        });
      }
      this.loading = false

      this.timeCall = 0

    }, error => {
      this.loading = false
     // console.log(error)
    })
  }

  time(date) {
    moment.locale('fr');
    return moment(date).fromNow()
  }



  checkFavorite(favorite, e) {
    this.contactService.checkFavorite(favorite).subscribe(res => {
      if (res['status'] == 201) {
        this.listPosts.push(
          {
            _id: e['_id'],
            userId: e['userId'],
            userPhoto_url: e['userPhoto_url'],
            userPseudo: e['userPseudo'],
            content: e['content'],
            image_url: e['image_url'],
            video_url: e['video_url'],
            backgroundColor: e['backgroundColor'],
            includedUsers: e['includedUsers'],
            createdAt: e['createdAt'],
            reposterId: e['reposterId'],
            matches: e['matches'],
            favorite: true
          },
        )

      } else {

        this.listPosts.push(
          {
            _id: e['_id'],
            userId: e['userId'],
            userPhoto_url: e['userPhoto_url'],
            userPseudo: e['userPseudo'],
            content: e['content'],
            image_url: e['image_url'],
            video_url: e['video_url'],
            backgroundColor: e['backgroundColor'],
            includedUsers: e['includedUsers'],
            createdAt: e['createdAt'],
            reposterId: e['reposterId'],
            matches: e['matches'],
            favorite: false
          },
        )
      }
      //console.log(this.listPosts)

    })
  }


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

  playVideoHosted(video) {
   // console.log('video')

    if (video) {
      this.isPlaying = true
      this.videoPlayer.play(video).then(() => {
     //   console.log('video completed');
        this.isPlaying = false
      }).catch(err => {
       // console.log(err);
       // alert(JSON.stringify(err))
        this.isPlaying = false

      });
    }

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
