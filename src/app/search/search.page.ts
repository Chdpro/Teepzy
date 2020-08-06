import { Component, OnInit } from '@angular/core';
import { ContactService } from '../providers/contact.service';
import * as moment from 'moment';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  
  private swipeCoord?: [number, number];
  private swipeTime?: number;
  selectedTab = 0

  search = {
    searchValue: '',
    userId:''
  }

  users = []
  projects = []
  products = []
  posts = []

  pageIndexT: number = 0;
  pageSizeT: number = 5;
  lowValueT: number = 0;
  highValueT: number = 5;

  constructor(private contactService: ContactService) { }

  ngOnInit() {
    this.search.userId = localStorage.getItem('teepzyUserId');

  }

  time(date) {
    moment.locale('fr');
    return moment(date).fromNow()
  }



  getPaginatorDataTeepzr(event) {
    console.log(event);
    if (event.pageIndex === this.pageIndexT + 1) {
      this.lowValueT = this.lowValueT + this.pageSizeT;
      this.highValueT = this.highValueT + this.pageSizeT;
    }
    else if (event.pageIndex === this.pageIndexT - 1) {
      this.lowValueT = this.lowValueT - this.pageSizeT;
      this.highValueT = this.highValueT - this.pageSizeT;
    }
    this.pageIndexT = event.pageIndex;
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
          if (this.selectedTab <= 4) {
            this.selectedTab = isFirst ? 1 : this.selectedTab + 1;
          }
          console.log("Swipe left - INDEX: " + this.selectedTab);
        } else if (swipe === 'previous') {
          const isLast = this.selectedTab === 4;
          if (this.selectedTab >= 1) {
            this.selectedTab = this.selectedTab - 1;
          }
          console.log("Swipe right — INDEX: " + this.selectedTab);
        }
        // Do whatever you want with swipe
      }
    }
  }

  searchOnMatches(){
    console.log(this.search)
    this.contactService.SearchOnMatch(this.search).subscribe(res =>{
      console.log(res);
      this.users = res['users']
      this.products = res['products']
      this.projects = res['projects']
      this.posts = res['posts']
    }, error =>{
      console.log(error)
    })
  }

}
