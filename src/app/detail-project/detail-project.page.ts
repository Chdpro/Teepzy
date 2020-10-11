import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactService } from '../providers/contact.service';
import { AuthService } from '../providers/auth.service';
import { DatapasseService } from '../providers/datapasse.service';

@Component({
  selector: 'app-detail-project',
  templateUrl: './detail-project.page.html',
  styleUrls: ['./detail-project.page.scss'],
})
export class DetailProjectPage implements OnInit {

  project = {
    _id:'',
    nom:'',
    photo:'',
    description:'',
    tags: []
  }

  listProjects = []
  userId = ''
  showDeleteBtn = false

  constructor(
    private menuCtrl: MenuController,
    private route: ActivatedRoute,
    private alertController:AlertController,
    private toastController:ToastController,
    private contactService: ContactService,
    private authService: AuthService,
    private dataPasse: DatapasseService,
    private router:Router
  ) {
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
   }

  ngOnInit() {
    let project = this.route.snapshot.paramMap['params']
    let tags = project.tags.split(',')
    this.project._id = project._id
    this.project.nom = project.nom 
    this.project.photo = project.photo
    this.project.description = project.description
    this.project.tags = tags
    this.userId = localStorage.getItem('teepzyUserId')
    this.userId === project.userId ? this.showDeleteBtn = true: this.showDeleteBtn = false

   
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
            this.delete(this.project._id)
          }
        },

      ]
    });
    await alert.present();

  }

  delete(id){
    this.contactService.deleteProject(id).subscribe(res =>{
      console.log(res)
      this.presentToast('Projet supprimé')
      this.getUserInfo(this.userId)
    }, error =>{
      console.log(error)
    })
  }

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
      console.log(res)
      this.listProjects = res['projects']
      this.dataPasse.sendProjects(this.listProjects)
      this.router.navigate(['/tabs/profile'])
    }, error => {
      console.log(error)
    })
  }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

}
