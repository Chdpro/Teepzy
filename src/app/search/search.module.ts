import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';
import { MaterialModule } from '../material.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { SearchPage } from './search.page';
import { MyFilterPipe } from '../pipes/filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    Ng2SearchPipeModule,
    SearchPageRoutingModule
  ],
  declarations: [SearchPage, MyFilterPipe]
})
export class SearchPageModule {}
