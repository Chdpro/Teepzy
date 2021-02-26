import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.page.html',
  styleUrls: ['./permissions.page.scss'],
})
export class PermissionsPage implements OnInit {

  constructor(
    private androidPermissions: AndroidPermissions,
    private diagnostic: Diagnostic,
    public router: Router,
  ) { }

  ngOnInit() {
  }

  requestNecessaryPermissions() {
    // Change this array to conform with the permissions you need
    const androidPermissionsList = [
      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
      this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
      this.androidPermissions.PERMISSION.READ_PHONE_STATE,
      this.androidPermissions.PERMISSION.WRITE_PHONE_STATE,
      this.androidPermissions.PERMISSION.READ_CONTACTS,
      this.androidPermissions.PERMISSION.WRITE_CONTACTS,
      this.androidPermissions.PERMISSION.CAMERA,
      this.androidPermissions.PERMISSION.ACCESS_NETWORK_STATE
    ];
    return this.androidPermissions.requestPermissions(androidPermissionsList);
  }

  requestPermissions(){
   this.requestNecessaryPermissions().then(()=>{
    this.router.navigate(['/contacts'])
   }, error=>{
    if (this.diagnostic.permissionStatus.DENIED_ALWAYS || this.diagnostic.permissionStatus.DENIED || this.diagnostic.permissionStatus.DENIED_ONCE) {
    this.requestNecessaryPermissions().then(() =>{})
    }
   })
  }

}
