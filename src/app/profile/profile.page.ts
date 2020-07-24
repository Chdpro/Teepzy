import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddProjectPage } from '../add-project/add-project.page';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../providers/auth.service';
import { DatapasseService } from '../providers/datapasse.service';
import { Subscription } from 'rxjs';
import { AddProductPage } from '../add-product/add-product.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user:any
  relationsCount = 0

  slideOpts = {
    initialSlide: 1,
    slidesPerView: 4,
    speed: 400,
    grabCursor: true,

  };

  isProProfile = true
  subscription: Subscription;  
  subscription2: Subscription;  

  listProjects = []
  listProducts = []


  constructor(private router: Router, private modalController: ModalController,
    private dataPass: DatapasseService,
     private authService: AuthService) { 
      this.subscription = this.dataPass.getPosts().subscribe(list => {  
        if (list.length > 0) {    
          this.listProjects = list     
        }  
      }); 
      this.subscription2 = this.dataPass.getProducts().subscribe(list => {  
        console.log( list) 
        if (list.length > 0) {    
          this.listProducts = list     
        }  
      }); 
     }

  ngOnInit() {
    let userId = localStorage.getItem('teepzyUserId')
    this.getUserInfo(userId)
  }

  goToEdit(){
    this.router.navigate(['/edit-profile'])
  }

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
      console.log(res)
      this.user = res['data'];
      this.listProjects = res['projects']
      this.listProducts = res['products']
      this.relationsCount = res['relationsCount']
    }, error => {
      console.log(error)
    })
  }

  switchProfile(){
    if (this.isProProfile == true) {
      this.isProProfile = false
    } else {
      this.isProProfile = true
    }
  }


  async presentAddProductModal() {
    const modal = await this.modalController.create({
      component: AddProductPage,
      cssClass: 'add-project-class'

    });
    return await modal.present();
  }

}
