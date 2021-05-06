import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.page.html',
  styleUrls: ['./forgot-pass.page.scss'],
})
export class ForgotPassPage implements OnInit {

  sanitizedURL = 'https://teepzy.com/reset-password-app/'
  constructor(
    public sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }


  ngAfterViewInit() {
    this.ref.detach()
  }

}
