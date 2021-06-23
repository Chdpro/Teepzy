import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ModalController, NavParams, ToastController, MenuController } from '@ionic/angular';
import { ContactService } from '../providers/contact.service';
//import { Socket } from 'ngx-socket-io';
import { DatapasseService } from '../providers/datapasse.service';
import { Globals } from '../globals';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {

  listComments = []

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

  listCommentsOfComment = []


  postId = ''
  commentId = ''
  userId = ''
  showResponsePanel = false
  
  subscription: Subscription
  @ViewChild('myInput', null) myInput: ElementRef;

  members = []
  constructor(private modalController: ModalController, 
    private contactService: ContactService,
    private toasterController: ToastController,
//    private socket: Socket,
    public globals: Globals,
    private menuCtrl: MenuController,
    private navParams: NavParams) {
      this.menuCtrl.close('first');
      this.menuCtrl.swipeGesture(false);
     }

  ngOnInit() {
    let post = this.navParams.data;
    this.getCommentsOfPost(post['_id'])
    this.userId = localStorage.getItem('teepzyUserId');
    this.getUsersOfCircle()
  }

  getUsersOfCircle() {
    this.contactService.getCircleMembers(this.userId).subscribe(res => {
      //console.log(res);
      this.members = res['data']
    }, error => {
      // console.log(error)
  
    })
  }
  


  resize() {
      this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
  }
  
  closeModalOnSwipeDown(event) {
    this.dismiss()
  }


  getCommentsOfPost(postId) {
    this.postId = postId
    this.contactService.getCommentsOfPost(postId).subscribe(res => {
     // console.log(res);
      this.listComments = res['data']
    }, error => {
   //   console.log(error)
    })
  }

  addCommentToPost() {
    this.commentT.userId = this.userId
    this.commentT.postId = this.postId
    this.contactService.addCommentToPost(this.commentT).subscribe(res => {
      if (res['status'] == 200) {
        this.commentT.comment = ''
        this.getCommentsOfPost(this.postId)
      }
    })

  }



  addCommentToComment() {
    this.commentC.userId = this.userId
    this.commentC.commentId = this.commentId
    this.contactService.addCommentToComment(this.commentC).subscribe(res => {
    //  console.log(res)
      if (res['status'] == 200) {
        //this.presentToast('')
        this.commentC.comment = ''
       // this.presentToast('Vous avez répondu')
        this.getCommentsOfComment(this.commentId)
      }
    }, error =>{
     // console.log(error)
      //this.presentToast('Oops! une erreur est survenue')

    })

  }

  getCommentsOfComment(commentId) {
    this.showResPanel()
    this.commentId = commentId
    this.contactService.getCommentsOfComment(commentId).subscribe(res => {
     // console.log(res);
      this.listCommentsOfComment = res['data']
    }, error => {
    //  console.log(error)
    })
  }



  showResPanel() {
  //  console.log('show panel')
    this.showResponsePanel ? this.showResponsePanel = false : this.showResponsePanel = true
  }



  async presentToast(msg) {
    const toast = await this.toasterController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }


  trackByFn(index, item) {
    return index; // or item.id
  }


  ionViewWillLeave() {
   // this.socket.disconnect();
   // console.log('disconnected')
    this.subscription?  this.subscription.unsubscribe() :  null

  }

  ngOnDestroy() { 
    this.subscription?  this.subscription.unsubscribe() :  null
  }
  
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
    this.globals.showBackground = false;
  }

}
