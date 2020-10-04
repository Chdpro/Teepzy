import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-detail-produit',
  templateUrl: './detail-produit.page.html',
  styleUrls: ['./detail-produit.page.scss'],
})
export class DetailProduitPage implements OnInit {

  product:any
  constructor(
    private menuCtrl: MenuController,
    private route: ActivatedRoute
  ) {
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
   }

  ngOnInit() {
    this.product = this.route.snapshot.paramMap['params']
    console.log(this.product)
  }

}
