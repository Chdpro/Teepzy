import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController, MenuController } from '@ionic/angular';
import { ContactService } from '../providers/contact.service';
import { Socket } from 'ngx-socket-io';
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
  constructor(private modalController: ModalController, 
    private contactService: ContactService,
    private toasterController: ToastController,
    private dataPasse: DatapasseService,
    private socket: Socket,
    private globals: Globals,
    private menuCtrl: MenuController,
    private navParams: NavParams) {
      this.menuCtrl.enable(false);

     }

  ngOnInit() {
    this.connectSocket()
    let post = this.navParams.data;
    this.getCommentsOfPost(post['_id'])
    console.log(post)
    this.userId = localStorage.getItem('teepzyUserId');
  }

  connectSocket(){
    this.socket.connect();
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
        this.socket.emit('notification', 'notification');
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



  showResPanel() {
    console.log('show panel')
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
    this.socket.disconnect();
    console.log('disconnected')
    this.subscription?  this.subscription.unsubscribe() :  null

  }

  ngOnDestroy() { 
    this.subscription?  this.subscription.unsubscribe() :  null
    this.socket.removeAllListeners('message');
    //this.socket.removeAllListeners('users-changed');
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
