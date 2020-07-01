import { Component, OnInit } from '@angular/core';
import { Contacts } from '@ionic-native/contacts/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { ContactService } from '../providers/contact.service';
import { ToastController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {

  myContacts = []
  listTeepzrsToInvite = []
  listContacts = []
  listTeepZrs = []

  contactsTest = [
    {
      givenName: 'Chris',
      familyName: 'Hounsounou',
      phone: '+22998090908',
      invited: false
    },
    {
      familyName
        :
        "Hounsounou",
      givenName
        :
        "christian",
      phone
        :
        "+229 66 77 23 27",
      invited: false,
      photo: "http://localhost:5000/1.png"

    },
    {
      givenName: 'Elvire',
      familyName: 'Anato',
      phone: '+229 98098867',
      invited: false

    },
    {
      givenName: 'Deborah',
      familyName: 'Houeha',
      phone: '+229 90980000',
      invited: true

    },
    {
      givenName: 'Claudia',
      familyName: 'Houeha',
      phone: '+229 66889545',
      invited: false

    }
  ]
  isDragged = true

  loading = false
  userId = ''
  term = ''
  contactsTests = []

  pageIndex: number = 0;
  pageSize: number = 5;
  lowValue: number = 0;
  highValue: number = 5;

  pageIndexT: number = 0;
  pageSizeT: number = 5;
  lowValueT: number = 0;
  highValueT: number = 5;

  constructor(private contacts: Contacts, private sms: SMS,
    public toastController: ToastController,
    private androidPermissions: AndroidPermissions,
    private socialSharing: SocialSharing,
    private contactService: ContactService) { }

  ngOnInit() {
    this.userId = localStorage.getItem('teepzyUserId');
   // this.loadContacts()
    let a =  '+229 66 77 23 27'
    let b = '+22966772327'
    console.log(a.replace(/\s/g, '') == b.replace(/\s/g, '') ? true: false)
    //this.getTeepzr()
  }


  trackByFn(index, item) {
    return index; // or item.id
  }


  
  getPaginatorData(event) {
    console.log(event);
    if (event.pageIndex === this.pageIndex + 1) {
      this.lowValue = this.lowValue + this.pageSize;
      this.highValue = this.highValue + this.pageSize;
    }
    else if (event.pageIndex === this.pageIndex - 1) {
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue = this.highValue - this.pageSize;
    }
    this.pageIndex = event.pageIndex;
  }

  getPaginatorDataTeepzr(event) {
    console.log(event);
    if (event.pageIndex === this.pageIndexT + 1) {
      this.lowValueT = this.lowValueT + this.pageSizeT;
      this.highValueT = this.highValueT + this.pageSizeT;
    }
    else if (event.pageIndex === this.pageIndex - 1) {
      this.lowValueT = this.lowValueT - this.pageSizeT;
      this.highValueT = this.highValueT - this.pageSizeT;
    }
    this.pageIndexT = event.pageIndex;
  }





  loadContacts() {
    this.loading = true
    let options = {
      filter: '',
      multiple: true,
      hasPhoneNumber: true
    }
    this.contacts.find(['*'], options).then((contacts) => {
      this.myContacts = contacts
  //    alert('Contacts succesfully loaded')

      for (const mC of this.myContacts) {
        this.loading = true
        let inviteViaSms = {
          phone: mC.phoneNumbers[0].value,
        }
        this.contactService.checkInviteViaSms(inviteViaSms).subscribe(res => {
          if (res['status'] == 201) {
            this.listContacts.push(
              {
                givenName: mC.name.givenName,
                familyName: mC.name.familyName,
                phone: mC.phoneNumbers[0].value,
                invited: true
              }
            )
          } else {
            this.listContacts.push(
              {
                givenName: mC.name.givenName,
                familyName: mC.name.familyName,
                phone: mC.phoneNumbers[0].value,
                invited: false
              }
            )
          }
          this.loading = false
        }, error => {
          this.loading = false
        })
      }
      this.getTeepzr()
      this.loading = false


    }, error => {
    })
  }

  getTeepzr() {
    let list = []
    this.contactService.teepZrs(this.userId).subscribe(res => {
      console.log(res)
      this.listTeepZrs = res['data']
      this.listContacts.forEach(um => {
        this.listTeepZrs.filter((x, index) => { x['phone'].replace(/\s/g, '') == um.phone.replace(/\s/g, '') ? list.push(x) : null })
      });
      this.listTeepZrs = list
      this.listTeepZrs.forEach(e => {
        let invitation = { idSender: this.userId, idReceiver: e['_id'] }
        this.contactService.checkInvitationTeepzr(invitation).subscribe(res => {
          if (res['status'] == 201) {
            this.listTeepzrsToInvite.push({ _id: e['_id'], nom: e['nom'], prenom: e['prenom'], phone: e['phone'], photo: e['photo'], invited: true })
            console.log(this.listTeepzrsToInvite)
          } else {
            this.listTeepzrsToInvite.push({ _id: e['_id'], nom: e['nom'], prenom: e['prenom'], phone: e['phone'], photo: e['photo'], invited: false })
            console.log(this.listTeepzrsToInvite)
          }
        })
      });
    }, error => {
      console.log(error)

    })
  }

  checkSMSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
      result => console.log('Has permission?', result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS)
    );
  }
  
  requestSMSPermission() {
    // tslint:disable-next-line: max-line-length
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.SEND_SMS, this.androidPermissions.PERMISSION.BROADCAST_SMS]);
  }



  sendShare(c) {
    this.socialSharing.share('Bonjour,  ' + '<br>' + "Je vous invite à rejoindre Teepzy. Téléchargez à ce lien", 'TeepZy' , null,
      ' https://play.google.com/store/apps/details?id=com.teepzy.com').then(() => {
        this.sendInvitationSmsToServer(c)
      }).catch((err) => {
      });
  }



  sendInvitationSmsToServer(phone) {
    let inviteViaSms = {
      senderId: this.userId,
      phone: phone
    }
    this.contactService.inviteViaSms(inviteViaSms).subscribe(res => {
      console.log(res)
      this.presentToast('Invitation envoyée')
      this.listContacts.find((c, index) => c['phone'].replace(/\s/g, '') == phone.replace(/\s/g, '') ? c['invited'] = true : null)
    }, error => {
      this.presentToast('Invitation non envoyée')
      alert(JSON.stringify(error))
    })
  }


  dleteInvitationSmsFromServer(phone) {
    let inviteViaSms = {
      senderId: this.userId,
      phone: phone
    }
    this.contactService.deleteInviteViaSms(inviteViaSms).subscribe(res => {
      console.log(res)
      this.presentToast('Invitation annulée')
      this.listContacts.find((c, index) => c['phone'].replace(/\s/g, '') == phone.replace(/\s/g, '') ? c['invited'] = false : null)
    }, error => {
      this.presentToast('Invitation non annulée')
    })
  }


  sendInvitationToJoinCircle(idReceiver) {
    console.log(idReceiver)
    this.loading = true
    let invitation = {
      idSender: this.userId,
      idReceiver: idReceiver
    }
    this.contactService.inviteToJoinCircle(invitation).subscribe(res => {
      console.log(res)
      this.listTeepzrsToInvite.find((c, index) => c['_id'] == idReceiver ? c['invited'] = true : null)
      this.presentToast('Invitation envoyée')
      console.log(this.listTeepzrsToInvite)
      //  this.getTeepzr()
      this.loading = false
    }, error => {
      this.presentToast('Invitation non envoyée')
      this.loading = false
      alert(JSON.stringify(error))

    })
  }

  listSorter(array: any) {
    array.sort((a, b) => a.name.givenName.localeCompare(b.name.givenName, 'fr', { sensitivity: 'base' }));
    return array;
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

}
