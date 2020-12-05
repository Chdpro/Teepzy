import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.page.html',
  styleUrls: ['./forgot-pass.page.scss'],
})
export class ForgotPassPage implements OnInit {

  sanitizedURL = 'https://teepzy.com/conditions-generales-dutilisations/'
  constructor(
    public sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
  }

}
