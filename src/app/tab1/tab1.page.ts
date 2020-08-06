import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { ContactService } from '../providers/contact.service';
import { ToastController, AlertController, IonSlides, MenuController, ModalController, IonRouterOutlet } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as moment from 'moment';
import { DatapasseService } from '../providers/datapasse.service';
import { Subscription } from 'rxjs';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { BottomSheetOverviewExampleSheetPage } from '../bottom-sheet-overview-example-sheet/bottom-sheet-overview-example-sheet.page';
import { LinkSheetPage } from '../link-sheet/link-sheet.page';
import { CommentsPage } from '../comments/comments.page';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';


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

  users = []



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

  @ViewChild(IonSlides, null) slides: IonSlides;

  navigationSubscription;

  constructor(private authService: AuthService,
    private toasterController: ToastController,
    private socialSharing: SocialSharing,
    private dataPass: DatapasseService,
    private _bottomSheet: MatBottomSheet,
    public alertController: AlertController,
    private menuCtrl: MenuController,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private socket: Socket,
    private router: Router,
    private contactService: ContactService) {
    this.menuCtrl.enable(true);
    this.menuCtrl.swipeGesture(true);

    this.subscription = this.dataPass.getPosts().subscribe(list => {
      console.log(list)
      if (list.length > 0) {
        this.listPosts = list
      }
    });
  }

  ngOnInit() {
    /*setTimeout(() => {
    window.location.href = window.location.href
      
    }, 500);*/
    this.connectSocket()
    this.userId = localStorage.getItem('teepzyUserId');
    this.getUserInfo(this.userId)
    this.getPosts(this.userId)


  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  connectSocket(){
    this.socket.connect();
    this.socket.fromEvent('user-notification').subscribe(notif => {
      console.log(notif)
    });
  }
  public next() {
    this.slides.slideNext();
  }

  public prev() {
    this.slides.slidePrev();
  }


  doRefresh(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      console.log('Async operation has ended');
      this.getPosts(this.userId)
      event.target.complete();
    }, 400);
  }



  trackByFn(index, item) {
    return index; // or item.id
  }

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
      console.log(res)
      this.user = res['data'];
    }, error => {
      console.log(error)
    })
  }

  goToContacts(){
    this.router.navigate(['/contacts', {previousUrl: 'feeds'}])

  }

  goToSearch(){
    this.router.navigateByUrl('/search')
    
  }
  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetOverviewExampleSheetPage);
  }

  showResPanel() {
    console.log('show panel')
    this.showResponsePanel ? this.showResponsePanel = false : this.showResponsePanel = true
  }

  sendShare() {
    this.socialSharing.share('Bonjour,  ' + '<br>' + this.repost['content'], 'TeepZy', null,
      ' https://play.google.com/store/apps/details?id=com.teepzy.com').then(() => {
      }).catch((err) => {
        alert(JSON.stringify(err))
      });
  }


  signaler(pId, reason) {
    let spam = {
      userId: this.userId,
      postId: pId,
      reason: reason
    }
    this.contactService.spam(spam).subscribe(res => {
      console.log(res)
      this.presentToast('Ce post a été signlé comme spam')
    }, error => {
      this.presentToast('Oops! une erreur est survenue')
      console.log(error)
    })
  }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Pourquoi signlez-vous cette publication ?',
      message: '',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.presentToast('Annulé')
          }
        }, {
          text: 'Lorem ipsum',
          handler: () => {
            let reason = 'Inaproprié'
            this.signaler(this.repost['postId'], reason)
          }
        }
        ,
        {
          text: 'Lorem ipsum',
          handler: () => {
            let reason = 'Inaproprié'
            this.signaler(this.repost['postId'], reason)
          }
        }
        ,
        {
          text: 'Lorem ipsum2',
          handler: () => {
            let reason = 'Lorem ipsum2'
            this.signaler(this.repost['postId'], reason)

          }
        }
      ]
    });
    await alert.present();

  }

  addFavorite(postId) {
    let favoris = {
      userId: this.userId,
      postId: postId
    }
    this.contactService.addFavorite(favoris).subscribe(res => {
      this.socket.emit('notification', 'notification');
      console.log(res)
      this.listPosts.find((c, index) => c['_id'] == postId ? c['favorite'] = true : null)
      this.presentToast('Ajouté aux favoris')
    }, error => {
      this.presentToast('Oops! une erreur est survenue')
      console.log(error)
    })
  }

  removeFavorite(postId) {
    let favoris = {
      userId: this.userId,
      postId: postId
    }
    this.contactService.removeFavorite(favoris).subscribe(res => {
      console.log(res)
      this.listPosts.find((c, index) => c['_id'] == postId ? c['favorite'] = false : null)
      this.presentToast('Enlevés des favoris')
    }, error => {
      this.presentToast('Oops! une erreur est survenue')
      console.log(error)
    })
  }

  async presentLinkModal(post) {
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


  async presentCommentModal(post) {
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








  openShareActionSheet(post) {
    console.log(post)
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

  rePost() {
    this.contactService.rePost(this.repost).subscribe(res => {
      console.log(res)
      this.getPosts(this.userId)
      this.presentToast('Ce post a été publié')
    }, error => {
      this.presentToast('Oops! une erreur est survenue')
      console.log(error)
    })
  }




  getPosts(userId) {
    this.timeCall = 1
    this.contactService.getPosts(userId).subscribe(res => {
      console.log(res)
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

      this.timeCall = 0

    }, error => {
      console.log(error)
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
            backgroundColor: e['backgroundColor'],
            includedUsers: e['includedUsers'],
            createdAt: e['createdAt'],
            reposterId: e['reposterId'],
            favorite: true
          },
        )

      } else {
        console.log('pas favoris')

        this.listPosts.push(
          {
            _id: e['_id'],
            userId: e['userId'],
            userPhoto_url: e['userPhoto_url'],
            userPseudo: e['userPseudo'],
            content: e['content'],
            image_url: e['image_url'],
            backgroundColor: e['backgroundColor'],
            includedUsers: e['includedUsers'],
            createdAt: e['createdAt'],
            reposterId: e['reposterId'],
            favorite: false
          },
        )
      }

      console.log(this.listPosts)
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
