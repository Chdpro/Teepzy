import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { ContactService } from '../providers/contact.service';
import { ToastController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as moment from 'moment';
import { DatapasseService } from '../providers/datapasse.service';
import { Subscription } from 'rxjs';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { BottomSheetOverviewExampleSheetPage } from '../bottom-sheet-overview-example-sheet/bottom-sheet-overview-example-sheet.page';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

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

  constructor(private authService: AuthService,
    private toasterController: ToastController,
    private socialSharing: SocialSharing,
    private dataPass: DatapasseService,
    private _bottomSheet: MatBottomSheet,
    private contactService: ContactService) { 

      this.subscription = this.dataPass.getPosts().subscribe(list => {  
        console.log( list) 
        if (list.length > 0) {    
          this.listPosts = list     
        }  
      });  
    }

  ngOnInit() {
    this.userId = localStorage.getItem('teepzyUserId');
    this.getUserInfo(this.userId)
    this.getPosts(this.userId)


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

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetOverviewExampleSheetPage);
  }

  showResPanel() {
    console.log('show panel')
    this.showResponsePanel ? this.showResponsePanel = false : this.showResponsePanel = true
  }

  sendShare(c) {
    this.socialSharing.share('Bonjour,  ' + '<br>' + c.content, 'TeepZy', null,
      ' https://play.google.com/store/apps/details?id=com.teepzy.com').then(() => {
      }).catch((err) => {
        alert(JSON.stringify(err))
      });
  }

  addFavorite(postId) {
    let favoris = {
      userId: this.userId,
      postId: postId
    }
    this.contactService.addFavorite(favoris).subscribe(res => {
      console.log(res)
      this.listPosts.find((c, index) => c['_id'] == postId ? c['favorite'] = true : null)
      this.presentToast('Ajouté aux favoris')
    }, error => {
      this.presentToast('Oops! une erreur est survenue')
      console.log(error)
    })
  }

  getCommentsOfPost(postId) {
    this.postId = postId
    this.contactService.getCommentsOfPost(postId).subscribe(res => {
      console.log(res);
      this.listComments = res['data']
    }, error => {
      console.log(error)
    })
  }

  addCommentToPost() {
    this.commentT.userId = this.userId
    this.commentT.postId = this.postId
    this.contactService.addCommentToPost(this.commentT).subscribe(res => {
      console.log(res)
      if (res['status'] == 200) {
        //this.presentToast('')
        this.commentT.comment = ''
        this.getCommentsOfPost(this.postId)
      }
    })

  }



  addCommentToComment() {
    this.commentC.userId = this.userId
    this.commentC.commentId = this.commentId
    this.contactService.addCommentToComment(this.commentC).subscribe(res => {
      console.log(res)
      if (res['status'] == 200) {
        //this.presentToast('')
        this.commentC.comment = ''
        this.presentToast('Vous avez répondu')
        this.getCommentsOfComment(this.commentId)
      }
    }, error =>{
      console.log(error)
      this.presentToast('Oops! une erreur est survenue')

    })

  }

  getCommentsOfComment(commentId) {
    this.showResPanel()
    this.commentId = commentId
    this.contactService.getCommentsOfComment(commentId).subscribe(res => {
      console.log(res);
      this.listCommentsOfComment = res['data']
    }, error => {
      console.log(error)
    })
  }


  getPosts(userId) {
      this.timeCall = 1

    this.contactService.getPosts(userId).subscribe(res => {
      console.log(res)
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
            includedCircles: e['includedCircles'],
            createdAt: e['createdAt'],
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
            includedCircles: e['includedCircles'],
            createdAt: e['createdAt'],
            favorite: false
          },
        )
      }

      console.log(this.listPosts)
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
