import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AddProjectPage } from '../add-project/add-project.page';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../providers/auth.service';
import { DatapasseService } from '../providers/datapasse.service';
import { Subscription } from 'rxjs';
import { AddProductPage } from '../add-product/add-product.page';
import { IonSlides } from '@ionic/angular';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-profile',
  animations: [
    trigger('slideIn', [
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition('* => void', [
        style({ height: '*' }),
        animate(250, style({ height: 0 }))
      ]),
      transition('void => *', [
        style({ height: '0' }),
        animate(250, style({ height: '*' }))
      ])
    ]),
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('800ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('800ms', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]
    )
  ],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: any
  relationsCount = 0

  slideOpts = {
    initialSlide: 1,
    slidesPerView: 3,
    speed: 400,
    noSwipingClass: 'swiper-no-swiping',

  };

  isProProfile = true
  subscription: Subscription;
  subscription2: Subscription;

  listProjects = []
  listProducts = []

  @ViewChild('slides', null) ionSlides: IonSlides;

  disablePrevBtn = true;
  disableNextBtn = true;

  private swipeCoord?: [number, number];
  private swipeTime?: number;
  selectedTab = 0

  constructor(private router: Router, private modalController: ModalController,
    private dataPass: DatapasseService,
    private authService: AuthService) {



    this.subscription = this.dataPass.getPosts().subscribe(list => {
      if (list.length > 0) {
        this.listProjects = list
      }
    });
    this.subscription2 = this.dataPass.getProducts().subscribe(list => {
      console.log(list)
      if (list.length > 0) {
        this.listProducts = list
      }
    });
  }

  ngOnInit() {
    let userId = localStorage.getItem('teepzyUserId')
    this.getUserInfo(userId)
  }

  next() {
    if (this.user.socialsPro.length <= 3) {
      this.ionSlides.lockSwipes(true)
    } else if (this.user.socialsAmical.length <= 3) {
      this.ionSlides.lockSwipes(true)
    } else {
      this.ionSlides.lockSwipes(false)
      this.ionSlides.slideNext()
      this.ionSlides.lockSwipes(true)
    }
  }


  prev() {
    if (this.user.socialsPro.length <= 3) {
      this.ionSlides.lockSwipes(true)
    } else if (this.user.socialsAmical.length <= 3) {
      this.ionSlides.lockSwipes(true)
    } else {
      this.ionSlides.lockSwipes(false)
      this.ionSlides.slidePrev()
      this.ionSlides.lockSwipes(true)
    }
  }

  goToEdit() {
    this.router.navigate(['/edit-profile'])
  }

  swipe(e: TouchEvent, when: string): void {
    this.switchProfile()
  }


  swipe2(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();
    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;
      if (duration < 1000 //
        && Math.abs(direction[0]) > 30 // Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
        const swipe = direction[0] < 0 ? 'next' : 'previous';
        console.info(swipe);
        if (swipe === 'next') {
          const isFirst = this.selectedTab === 0;
          if (this.selectedTab <= 2) {
            this.selectedTab = isFirst ? 1 : this.selectedTab + 1;
          }
          console.log("Swipe left - INDEX: " + this.selectedTab);
        } else if (swipe === 'previous') {
          const isLast = this.selectedTab === 2;
          if (this.selectedTab >= 1) {
            this.selectedTab = this.selectedTab - 1;
          }
          console.log("Swipe right — INDEX: " + this.selectedTab);
        }
        // Do whatever you want with swipe
      }
    }
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


  doRefresh(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      console.log('Async operation has ended');
      let userId = localStorage.getItem('teepzyUserId')
      this.getUserInfo(userId)
      event.target.complete();
    }, 400);
  }

  doCheck() {
    let prom1 = this.ionSlides.isBeginning();
    let prom2 = this.ionSlides.isEnd();
    Promise.all([prom1, prom2]).then((data) => {
      data[0] ? this.disablePrevBtn = true : this.disablePrevBtn = false;
      data[1] ? this.disableNextBtn = true : this.disableNextBtn = false;
    });
  }

  switchProfile() {
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


  async presentAddProjectModal() {
    const modal = await this.modalController.create({
      component: AddProjectPage,
      cssClass: 'add-project-class'

    });
    return await modal.present();
  }

}
