import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ContactService } from '../providers/contact.service';
import { AuthService } from '../providers/auth.service';
import { ToastController, AlertController, IonSlides, MenuController, ModalController, IonRouterOutlet } from '@ionic/angular';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { LinkSheetPage } from '../link-sheet/link-sheet.page';
import { CommentsPage } from '../comments/comments.page';
import { Socket } from 'ngx-socket-io';
import { Router, ActivatedRoute } from '@angular/router';
import { Globals } from '../globals';
import { ShareSheetPage } from '../share-sheet/share-sheet.page';
import { EditPostPage } from '../edit-post/edit-post.page';
import { DatapasseService } from '../providers/datapasse.service';
import { type, MESSAGES } from '../constant/constant';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-detail-feed',
  templateUrl: './detail-feed.page.html',
  styleUrls: ['./detail-feed.page.scss'],
})
export class DetailFeedPage implements OnInit {



  user: any

  listPosts = []
  post: any
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

  currentPlaying = null
  @ViewChild('videoPlayer', null) videoPlayers: ElementRef;


  previousRoute = ''

  previousBackUrl = ''

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };


  loading: Boolean
  constructor(private authService: AuthService,
    private toasterController: ToastController,
    public alertController: AlertController,
    private menuCtrl: MenuController,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    public sanitizer: DomSanitizer,
    private socket: Socket,
    private router: Router,
    public globals: Globals,
    public route: ActivatedRoute,
    private dataPasse: DatapasseService,
    private contactService: ContactService) {
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
    this.global = globals;
    this.previousRoute = this.route.snapshot.paramMap.get('previousUrl')
    this.subscription = this.dataPasse.get().subscribe(p => {
      //   console.log(p)
      if (p) {
        this.post = p
      }
    });
  }

  ionViewWillEnter() {
    this.userId = localStorage.getItem('teepzyUserId');
    this.getUserInfo(this.userId)
    let idTeepz = this.route.snapshot.paramMap.get('idTeepz')
    this.previousBackUrl = this.route.snapshot.paramMap.get('previousBackUrl')
    console.log(this.previousBackUrl)
    this.getAPost(idTeepz)
    this.getRepost(idTeepz)

  }


  ngOnInit() {

  }

  goToProfile(userId) {
    console.log(userId)
    if (this.userId === userId) {
      this.router.navigate(['/tabs/profile', { userId: userId }])
    } else {
      this.router.navigate(['/profile', { userId: userId, previousUrl: 'feed' }])
    }

  }

  getAPost(idTeepz) {

    let post = {
      idPost: idTeepz,
      userId: this.userId
    }
    this.loading = true
    this.contactService.getPost(post).subscribe(res => {
      console.log(res)
      let post = res['data'];
      if (post) {
        let favorite = {
          userId: this.userId,
          postId: post._id
        }
        this.checkFavorite(favorite, post)
        this.loading = false
      }
    }, error => {
      //  console.log(error)
      this.loading = false

    })

  }

  getRepost(idTeepz) {
    let post = {
      idPost: idTeepz,
      userId: this.userId
    }
    this.loading = true
    this.contactService.getRePost(post).subscribe(res => {
      console.log(res)
      this.post == null ? this.post = res['data'] : null;
      if (this.post) {
        let favorite = {
          userId: this.userId,
          postId: this.post._id
        }
        this.checkFavorite(favorite, this.post)
      }
      this.loading = false
    }, error => {
      //  console.log(error)
      this.loading = false

    })
  }


  async presentPostEditModal() {

    const modal = await this.modalController.create({
      component: EditPostPage,
      componentProps: this.post,
      cssClass: 'edit-post-custom-class',
      presentingElement: this.routerOutlet.nativeEl,
    });
    return await modal.present();
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }


  connectSocket() {
    this.socket.connect();
    this.socket.fromEvent('user-notification').subscribe(notif => {
      //console.log(notif)
    });
  }



  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: "Supprimer ?",
      message: '',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.presentToast('Annulé')
          }
        },

        {
          text: 'Oui',
          handler: () => {
            this.delete()
          }
        },

      ]
    });
    await alert.present();

  }


  getMyPosts(userId) {
    this.contactService.teepZ(userId).subscribe(res => {
      //  console.log(res)
      let listTeepz = res['data'];
      this.dataPasse.sendPosts(listTeepz)
    }, error => {
      // console.log(error)
    })
  }

  getMyFavoritePosts(userId) {
    this.contactService.favorites(userId).subscribe(res => {
      //  console.log(res)
      let listFavorites = res['data'];
      this.dataPasse.sendFavorite(listFavorites)
    }, error => {
      // console.log(error)
    })
  }


  delete() {
    this.post.postId ? this.deleteRePost() : this.deletePost()
    this.router.navigateByUrl('/tabs/profile')
  }



  deletePost() {
    this.contactService.deletePost(this.post._id).subscribe(res => {
      // console.log(res)
      this.getMyPosts(this.userId)
      this.getMyFavoritePosts(this.userId)
      this.presentToast(MESSAGES.DELETE_FEED_OK)

    }, error => {
      // console.log(error)
      this.presentToast(MESSAGES.DELETE_FEED_ERROR)
    })

  }

  deleteRePost() {
    this.contactService.deleteRePost(this.post._id).subscribe(res => {
      // console.log(res)
      this.getMyPosts(this.userId)
      this.getMyFavoritePosts(this.userId)
      this.presentToast(MESSAGES.DELETE_FEED_OK)
    }, error => {
      // console.log(error)
      this.presentToast(MESSAGES.DELETE_FEED_ERROR)
    })

  }


  playVideo(videoUrl?: any) {
    //console.log(videoUrl)
    const nativeElement = this.videoPlayers.nativeElement;
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

  stopVideo() {
    const nativeElement = this.videoPlayers.nativeElement;
    this.currentPlaying = nativeElement;
    this.currentPlaying.muted = true;
    this.currentPlaying.pause();
    this.currentPlaying = null
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




  trackByFn(index, item) {
    return index; // or item.id
  }

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
      //console.log(res)
      this.user = res['data'];
    }, error => {
      //console.log(error)
    })
  }

  goToContacts() {
    this.router.navigate(['/contacts', { previousUrl: 'feeds' }])

  }

  goToSearch() {
    this.router.navigateByUrl('/search')

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

  addFavorite(post) {
    let favoris = {
      userId: this.userId,
      postId: post._id,
      type: type.POST
    }
    this.contactService.addFavorite(favoris).subscribe(res => {
      this.socket.emit('notification', 'notification');
      //console.log(res)
      this.post = {
        _id: post['_id'],
        userId: post['userId'],
        userPhoto_url: post['userPhoto_url'],
        userPseudo: post['userPseudo'],
        content: post['content'],
        image_url: post['image_url'],
        backgroundColor: post['backgroundColor'],
        includedUsers: post['includedUsers'],
        createdAt: post['createdAt'],
        reposterId: post['reposterId'],
        favorite: false
      }
      this.presentToast(MESSAGES.FAVORITE_OK)
    }, error => {
      this.presentToast(MESSAGES.FAVORITE_ERROR)
      //console.log(error)
    })
  }

  removeFavorite(post) {
    let favoris = {
      userId: this.userId,
      postId: post._id
    }
    this.contactService.removeFavorite(favoris).subscribe(res => {
      // console.log(res)
      this.post = {
        _id: post['_id'],
        userId: post['userId'],
        userPhoto_url: post['userPhoto_url'],
        userPseudo: post['userPseudo'],
        content: post['content'],
        image_url: post['image_url'],
        backgroundColor: post['backgroundColor'],
        includedUsers: post['includedUsers'],
        createdAt: post['createdAt'],
        reposterId: post['reposterId'],
        favorite: false
      }


      this.presentToast(MESSAGES.REMOVE_FAVORITE_OK)
    }, error => {
      this.presentToast(MESSAGES.REMOVE_FAVORITE_ERROR)
      // console.log(error)
    })
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



  time(date) {
    moment.locale('fr');
    return moment(date).fromNow()
  }



  checkFavorite(favorite, e) {
    this.contactService.checkFavorite(favorite).subscribe(res => {
      if (res['status'] == 201) {
        this.post = {
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
          favorite: true,
          nbrComments: e['nbrComments'],
          favoriteCount: e['favoriteCount'],
          repostCounts: e['repostCounts'],
          matches: e['matches']

      
        }
      } else {
        this.post = {
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
          favorite: false,
          nbrComments: e['nbrComments'],
          favoriteCount: e['favoriteCount'],
          repostCounts: e['repostCounts'],
          matches: e['matches']
      
        }
      }
    })
  }


  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

}
