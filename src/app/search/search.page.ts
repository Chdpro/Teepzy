import { Component, OnInit } from '@angular/core';
import { ContactService } from '../providers/contact.service';

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

  constructor(private contactService: ContactService) { }

  ngOnInit() {
    this.search.userId = localStorage.getItem('teepzyUserId');

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
