import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { ContactService } from '../providers/contact.service';

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
  
  constructor(private modalController: ModalController, 
    private contactService: ContactService,
    private toasterController: ToastController,
    private navParams: NavParams) { }

  ngOnInit() {
    let post = this.navParams.data;
    this.getCommentsOfPost(post['_id'])
    console.log(post)
    this.userId = localStorage.getItem('teepzyUserId');
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

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
