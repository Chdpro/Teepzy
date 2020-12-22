import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, AlertController, ToastController } from '@ionic/angular';
import { ContactService } from '../providers/contact.service';
import { AuthService } from '../providers/auth.service';
import { DatapasseService } from '../providers/datapasse.service';
import { MESSAGES } from '../constant/constant';
import { Globals } from '../globals';

@Component({
  selector: 'app-detail-produit',
  templateUrl: './detail-produit.page.html',
  styleUrls: ['./detail-produit.page.scss'],
})
export class DetailProduitPage implements OnInit {

  product = {
    _id: '',
    nom: '',
    photo: '',
    description: '',
    price: '',
    tags: [],
  }
  userId = ''

  listProducts = []

  showDeleteBtn = false

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  
  constructor(
    private menuCtrl: MenuController,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private toastController: ToastController,
    private contactService: ContactService,
    private authService: AuthService,
    private dataPasse: DatapasseService,
    public globals: Globals,
    private router: Router,
  ) {
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
  }

  ngOnInit() {
    let product = this.route.snapshot.paramMap['params']
    console.log(product)
    let tags = product.tags.split(',')
    this.product._id = product._id
    this.product.nom = product.nom
    this.product.photo = product.photo
    this.product.description = product.description
    this.product.tags = tags
    this.product.price = product.price
    this.userId = localStorage.getItem('teepzyUserId')
    this.userId === product.userId ? this.showDeleteBtn = true: this.showDeleteBtn = false
   // console.log(tags)
   // console.log(product)
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
            this.delete(this.product._id)
          }
        },

      ]
    });
    await alert.present();

  }

  delete(id) {
    this.contactService.deleteProduct(id).subscribe(res => {
     // console.log(res)
      this.presentToast(MESSAGES.SHOP_DELETED_OK)
      this.getUserInfo(this.userId)
    }, error => {
     // console.log(error)
    })
  }

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
   //   console.log(res)
      this.listProducts = res['products']
      this.dataPasse.sendProducts(this.listProducts)
      this.router.navigateByUrl('/tabs/profile')

    }, error => {
    //  console.log(error)
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
