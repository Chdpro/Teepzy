import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';
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
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { MAT_DATE_LOCALE } from '@angular/material';
import { DatapasseService } from './providers/datapasse.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { CommentsPageModule } from './comments/comments.module';
import { LinkSheetPageModule } from './link-sheet/link-sheet.module';
import { AddProductPageModule } from './add-product/add-product.module';
import { AddProjectPageModule } from './add-project/add-project.module';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { IonicSwipeAllModule } from 'ionic-swipe-all';
import {
  CameraPreview,
} from "@ionic-native/camera-preview/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Base64 } from '@ionic-native/base64/ngx';

import { local_url, base_url, test_url } from 'src/config';
import { Globals } from './globals';
import { ShareSheetPageModule } from './share-sheet/share-sheet.module';
import { EditPostPageModule } from './edit-post/edit-post.module';
import { AddPeopleRoomPageModule } from './add-people-room/add-people-room.module';
import { UploadService } from './providers/upload.service';
import { File } from '@ionic-native/file/ngx';
import { GroupInvitationPageModule } from './group-invitation/group-invitation.module';
import { Autosize } from './components/autosize';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { NetworkService } from './providers/network.service';
import { Network } from '@ionic-native/network/ngx';
import { IonicStorageModule } from '@ionic/storage';
import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';
import { CacheModule } from "ionic-cache-observable";
const config: SocketIoConfig = { url: base_url, options: { }};

@NgModule({
  declarations: [AppComponent,Autosize],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCarouselModule.forRoot(),
    IonicStorageModule.forRoot(),
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
   // AddPostPageModule,
    EditPostPageModule,
    GroupInvitationPageModule,
    AddProductPageModule,
    AddProjectPageModule,
    AddPeopleRoomPageModule,
    ShareSheetPageModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    CacheModule,
    //CircleMembersPageModule,
    CommentsPageModule,
    LinkSheetPageModule,
    Ng2SearchPipeModule,
    IonicSwipeAllModule,
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
    FilePath,
    SMS,
    File,
    VideoPlayer,
    CameraPreview,
    FileOpener,
    FileChooser,
    WebView,
    Contacts,
    OneSignal,
    Clipboard,
    Globals,
    Diagnostic,
    Base64,
    VideoPlayer,
    MediaCapture,
    UploadService,
    NetworkService,
    Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
    { 
      provide: HAMMER_GESTURE_CONFIG, 
      useClass: HammerGestureConfig 
  }
  ],
  //ionic cordova plugin remove cordova-plugin-file
  //ionic cordova plugin remove cordova-plugin-file-transfer
  //ionic cordova plugin remove cordova-plugin-filepath
  //ionic cordova plugin remove cordova-plugin-media-capture
  //ionic cordova plugin remove cordova-plugin-camera
  //ionic cordova plugin remove https://github.com/moust/cordova-plugin-videoplayer.git
  //ionic cordova plugin remove cordova-sms-plugin

  //ionic cordova plugin add cordova-plugin-file
  //ionic cordova plugin add cordova-plugin-file-transfer
  //ionic cordova plugin add cordova-plugin-filepath
  //ionic cordova plugin add cordova-plugin-media-capture
  //ionic cordova plugin add cordova-plugin-camera
  //ionic cordova plugin add https://github.com/moust/cordova-plugin-videoplayer.git
  //ionic cordova plugin add cordova-sms-plugin

  bootstrap: [AppComponent]
})
export class AppModule { }
