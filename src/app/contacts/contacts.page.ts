import { Component, OnInit } from '@angular/core';
import { Contacts } from '@ionic-native/contacts/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { ContactService } from '../providers/contact.service';
import { ToastController } from '@ionic/angular';


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
    private contactService: ContactService) { }

  ngOnInit() {
    this.userId = localStorage.getItem('teepzyUserId');
    //  this.contactsTests = this.listSorter(this.contactsTest) 
    // this.loadContacts()
    this.getTeepzr()
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
      this.myContacts = this.listSorter(contacts)
      for (const mC of this.myContacts) {
        let inviteViaSms = {
          phone: mC.phoneNumbers[0].value,
        }
        this.contactService.checkInviteViaSms(inviteViaSms).subscribe(res => {
          console.log(res)
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
          alert(JSON.stringify(error))
          this.loading = false

        })
      }
    })
  }

  getTeepzr() {
    let list = []
    this.loading = true
    this.contactService.teepZrs(this.userId).subscribe(res => {
      console.log(res)
      this.listTeepZrs = res['data']
      this.contactsTest.forEach(um => {
        this.listTeepZrs.filter((x, index) => { x['phone'] == um.phone ? list.push(x) : null})
      });
      this.loading = false
      this.listTeepZrs = list
      console.log(list)
      this.listTeepZrs.forEach(e => {
        let invitation = {idSender: this.userId, idReceiver: e['_id']}
        this.contactService.checkInvitationTeepzr(invitation).subscribe(res => {
          console.log(res)
          if (res['status'] == 201) {
            this.listTeepzrsToInvite.push({_id: e['_id'],nom: e['nom'],prenom: e['prenom'],phone: e['phone'],invited: true},)

          } else {
            this.listTeepzrsToInvite.push({_id: e['_id'],nom: e['nom'],prenom: e['prenom'],phone: e['phone'],invited: false},)
          }
        })
      });
      console.log(this.listTeepZrs)
    }, error => {
      console.log(error)
      this.loading = false

    })
  }


  sendSms(contact) {
    this.sms.send(contact, "This is my predefined to you").then((res) => {
      if (res) {
        this.sendInvitationSmsToServer(contact)
      }
    }, error => {
      console.log(error)
      alert(JSON.stringify(error))
    })
  }

  sendInvitationSmsToServer(phone) {
    let inviteViaSms = {
      senderId: this.userId,
      phone: phone
    }
    this.contactService.inviteViaSms(inviteViaSms).subscribe(res => {
      console.log(res)
      this.presentToast('Invitation envoyée')
      this.listContacts.find((c, index) => c['phone'] == phone ? c['invited'] = true : null)
    }, error => {
      this.presentToast('Invitation non envoyée')
      alert(JSON.stringify(error))
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
    array.sort((a, b) => a.name.familyName.localeCompare(b.name.familyName, 'fr', { sensitivity: 'base' }));
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
