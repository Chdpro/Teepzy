import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-bottom-sheet-overview-example-sheet',
  templateUrl: './bottom-sheet-overview-example-sheet.page.html',
  styleUrls: ['./bottom-sheet-overview-example-sheet.page.scss'],
})
export class BottomSheetOverviewExampleSheetPage implements OnInit {

  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheetPage>) { }

  ngOnInit() {
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
