import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-detail-produit',
  templateUrl: './detail-produit.page.html',
  styleUrls: ['./detail-produit.page.scss'],
})
export class DetailProduitPage implements OnInit {

  product = {
    nom:'',
    photo:'',
    description:'',
    price: '',
    tags: []
  }
  constructor(
    private menuCtrl: MenuController,
    private route: ActivatedRoute
  ) {
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
   }

  ngOnInit() {
    let product = this.route.snapshot.paramMap['params']
    let tags = product.tags.split(',')
    this.product.nom = product.nom 
    this.product.photo = product.photo
    this.product.description = product.description
    this.product.tags = tags
    this.product.price = product.price
    console.log(tags)
    console.log(product)
  }

}
