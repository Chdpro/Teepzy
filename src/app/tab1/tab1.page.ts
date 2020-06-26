import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';

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

  constructor(private authService: AuthService) { }

  ngOnInit() {
    let userId = localStorage.getItem('teepzyUserId');
    this.getUserInfo(userId)
  }

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
      console.log(res)
      this.user = res['data'];
    }, error =>{
      console.log(error)
    })
  }

}
