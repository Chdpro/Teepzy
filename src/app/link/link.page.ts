import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-link',
  templateUrl: './link.page.html',
  styleUrls: ['./link.page.scss'],
})
export class LinkPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }
  goToContacts(){
    this.router.navigate(['/contacts'], {
      replaceUrl: true,
    })
  }

}
