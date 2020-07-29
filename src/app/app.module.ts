import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from './providers/auth.service';
import { WindowService } from './providers/window.service';

import { SMS } from '@ionic-native/sms/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { AddPostPageModule } from './add-post/add-post.module';
import { EmojiPickerModule } from 'ng-emoji-picker';
import { MAT_DATE_LOCALE } from '@angular/material';
import { DatapasseService } from './providers/datapasse.service';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { BottomSheetOverviewExampleSheetPageModule } from './bottom-sheet-overview-example-sheet/bottom-sheet-overview-example-sheet.module';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { CommentsPageModule } from './comments/comments.module';
import { LinkSheetPageModule } from './link-sheet/link-sheet.module';
import { AddProductPageModule } from './add-product/add-product.module';
import { AddProjectPageModule } from './add-project/add-project.module';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { local_url } from 'src/config';
const config: SocketIoConfig = { url: local_url, options: {} };

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule,
    HttpClientModule,
    AddPostPageModule,
    AddProductPageModule,
    AddProjectPageModule,
    CommentsPageModule,
    LinkSheetPageModule,
    BottomSheetOverviewExampleSheetPageModule,
    Ng2SearchPipeModule,
    EmojiPickerModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClient,
    AuthService,
    WindowService,
    DatapasseService,
    MatBottomSheet,
    AndroidPermissions,
    SocialSharing,
    ImagePicker,
    Camera,
    FileTransfer,
    File,
    FilePath,
    SMS,
    Contacts,
    OneSignal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
    { 
      provide: HAMMER_GESTURE_CONFIG, 
      useClass: HammerGestureConfig 
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
