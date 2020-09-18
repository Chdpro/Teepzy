import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ContactService } from '../providers/contact.service';
import { AuthService } from '../providers/auth.service';
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
import { Router, ActivatedRoute } from '@angular/router';
import { Globals } from '../globals';


@Component({
  selector: 'app-detail-feed',
  templateUrl: './detail-feed.page.html',
  styleUrls: ['./detail-feed.page.scss'],
})
export class DetailFeedPage implements OnInit {



  user: any

  listPosts = []
  post:any
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

  isPlaying = false
  showBackground = false
  global: Globals;
  navigationSubscription;

  @ViewChild('videoPlayer', null) videoplayer: ElementRef;


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
    private globals: Globals,
    public route: ActivatedRoute,
    private contactService: ContactService) {
    this.menuCtrl.enable(false);
    this.menuCtrl.swipeGesture(true);
    this.global = globals;
    let idTeepz = this.route.snapshot.paramMap.get('idTeepz')
   
  }

  ngOnInit() {

  }


  getAPost(idTeepz){
    this.contactService.getPost(idTeepz).subscribe(res =>{
      console.log(res)
      this.post = res['data'];
    }, error =>{
      console.log(error)
    })
  }

  ionViewWillEnter() {
    this.userId = localStorage.getItem('teepzyUserId');
    this.getUserInfo(this.userId)
    this.getPosts(this.userId)
    let idTeepz = this.route.snapshot.paramMap.get('idTeepz')
    this.getAPost(idTeepz)
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }


  connectSocket() {
    this.socket.connect();
    this.socket.fromEvent('user-notification').subscribe(notif => {
      console.log(notif)
    });
  }

  toggleVideo(event?: any) {
    this.isPlaying = true
    this.videoplayer.nativeElement.play()


  }


  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
    if ( this.globals.showBackground) {
      this.globals.showBackground = false;
    } else {
      this.globals.showBackground = true;
    }
  }

  dismissShareSheet(){
    if (this.shareLink) {
      this.shareLink = false
    } else {
      this.shareLink = true
    }
  
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

  goToContacts() {
    this.router.navigate(['/contacts', { previousUrl: 'feeds' }])

  }

  goToSearch() {
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
    if ( this.globals.showBackground) {
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


  async presentCommentModal(post) {
    if ( this.globals.showBackground) {
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
