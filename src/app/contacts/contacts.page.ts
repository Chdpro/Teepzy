import { Component, OnInit } from '@angular/core';
import { Contacts } from '@ionic-native/contacts/ngx';
import { ContactService } from '../providers/contact.service';
import { ToastController, AlertController, MenuController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Router, ActivatedRoute } from '@angular/router';
//import { Socket } from 'ngx-socket-io';
import { AuthService } from '../providers/auth.service';
import { typeAccount, CACHE_KEYS } from '../constant/constant';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {

  term: any
  contact: any
  pageEvent: any
  userInfo: any
  myContacts = []
  listTeepzrsToInvite = []
  listTeepzrsToInviteOutCircle = []
  listContacts = []
  listTeepZrs = []
  circleMembersId = []
  contactsTest = [
    {
      name: { givenName: 'Chris', familyName: 'Placktor', },
      phoneNumbers: [{ value: '+22998148917' }, { value: '+229 98 14 89 17' }],
    },
    {
      name: { givenName: 'Hervé ', familyName: 'KITEBA SIMO', },
      phoneNumbers: [{ value: '+33679560431' }, { value: '+33 67 95 60 431' }],
    },

    {
      name: { givenName: 'Ridy', familyName: 'FRANCE' },
      phoneNumbers: [{ value: '+330663534043' }, { value: '+33 06 63 53 40 43' }, { value: '+33 06 63 53 40 42' }],
    },

    {
      name: { givenName: 'Debor', familyName: 'oueha' },
      phoneNumbers: [{ value: '+22990980000' }, { value: '+229 90 98 00 00' }],
    },
    {
      name: { givenName: 'Deborah', familyName: 'Houeha' },
      phoneNumbers: [{ value: '+22990980000' }, { value: '+229 90 98 00 00' }],
    },
    {
      name: { givenName: 'Claudia', familyName: 'Houeha' },
      phoneNumbers: [{ value: '+22966889545' }, { value: '+229 66 88 95 45' }],

    }
  ]
  isDragged = true
  loading = false
  userId = ''
  arrayIncrementLoading = 0

  pageIndex: number = 0;
  pageSize: number = 5;
  lowValue: number = 0;
  highValue: number = 5;

  pageIndexT: number = 0;
  pageSizeT: number = 5;
  lowValueT: number = 0;
  highValueT: number = 5;

  userPhone = ''
  previousUrl: string;


  private swipeCoord?: [number, number];
  private swipeTime?: number;
  selectedTab = 0

  previousRoute = ''
  constructor(private contacts: Contacts,
    //private sms: SMS,
    public toastController: ToastController,
    private socialSharing: SocialSharing,
    public router: Router,
    public route: ActivatedRoute,
    //  private socket: Socket,
    public alertController: AlertController,
    private authService: AuthService,
    private menuCtrl: MenuController,
    private contactService: ContactService) {
    this.menuCtrl.close('first');
    this.menuCtrl.swipeGesture(false);
    this.previousRoute = this.route.snapshot.paramMap.get('previousUrl')
  }

  ngOnInit() {
    this.userId = localStorage.getItem('teepzyUserId');
    this.userPhone = localStorage.getItem('teepzyPhone')
    this.getUsersOfCircle()
    this.connectSocket()
    this.getUserInfo(this.userId)
    this.getTeepzrOutCircle()
  }

  connectSocket() {
    //this.socket.connect();
  }


  trackByFn(index, item) {
    return index; // or item.id
  }


  swipe2(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();
    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;
      if (duration < 1000 //
        && Math.abs(direction[0]) > 30 // Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
        const swipe = direction[0] < 0 ? 'next' : 'previous';
        console.info(swipe);
        if (swipe === 'next') {
          const isFirst = this.selectedTab === 0;
          if (this.selectedTab <= 3) {
            this.selectedTab = isFirst ? 1 : this.selectedTab + 1;
          }
          //  console.log("Swipe left - INDEX: " + this.selectedTab);
        } else if (swipe === 'previous') {
          const isLast = this.selectedTab === 3;
          if (this.selectedTab >= 1) {
            this.selectedTab = this.selectedTab - 1;
          }
          //  console.log("Swipe right — INDEX: " + this.selectedTab);
        }
        // Do whatever you want with swipe
      }
    }
  }



  getPaginatorData(event) {
    //console.log(event);
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
    // console.log(event);
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




  getUniques(myArray) {
    let uniqueChars = [];
    myArray.forEach((c) => {
      if (!uniqueChars.includes(c.value.toString().replace(/\s/g, ''))) {
        uniqueChars.push(c.value);
      }
    });

    return uniqueChars;
  }

  getUniquesOnContacts(myArray) {
    let hash = Object.create(null);
    let uniqueChars = [];
    myArray.forEach((c) => {
      var key = JSON.stringify(c);
      hash[key] = (hash[key] || 0) + 1;
      hash[key] >= 2 ? null : uniqueChars.push(c);
    });
    return uniqueChars;
  }

  getCachedContacts() {
    this.contactService.getContactsCached(CACHE_KEYS.CONTACTS).subscribe(val =>{
      let contacts = val
      alert(contacts)
      alert(JSON.stringify(contacts))
     // alert(JSON.parse(contacts))
      if (contacts) {
         this.myContacts = this.getUniquesOnContacts(contacts)
         alert(contacts)
         alert(this.myContacts)
         for (const mC of contacts) {
           let inviteViaSms = {
             phone: mC.phoneNumbers[0].value,
           }
           this.contactService.checkInviteViaSms(inviteViaSms).subscribe(res => {
             if (res['status'] == 201) {
               let phones = this.getUniques(mC.phoneNumbers)
               this.listContacts.push(
                 {
                   givenName: mC.name.givenName,
                   familyName: mC.name.familyName,
                   phone: phones,
                   invited: true
                 }
               )
             } else {
               let phones = this.getUniques(mC.phoneNumbers)
               this.listContacts.push(
                 {
                   givenName: mC.name.givenName,
                   familyName: mC.name.familyName,
                   phone: phones,
                   invited: false
                 }
               )
             }
           }, error => {
             this.loading = false
           })
   
   
         }
         this.getTeepzr()
       } else {
         this.loadContacts()
       }
    })
   
  }


  loadContacts() {
    this.loading = true
    let options = {
      filter: '',
      multiple: true,
      hasPhoneNumber: true
    }
    //  this.myContacts = this.contactsTest
    this.contacts.find(['*'], options).then((contacts) => {
      this.myContacts = this.getUniquesOnContacts(contacts)
      for (const mC of this.myContacts) {
        let inviteViaSms = {
          phone: mC.phoneNumbers[0].value,
        }
        this.contactService.checkInviteViaSms(inviteViaSms).subscribe(res => {
          if (res['status'] == 201) {
            let phones = this.getUniques(mC.phoneNumbers)
            this.listContacts.push(
              {
                givenName: mC.name.givenName,
                familyName: mC.name.familyName,
                phone: phones,
                invited: true
              }
            )
          } else {
            let phones = this.getUniques(mC.phoneNumbers)
            this.listContacts.push(
              {
                givenName: mC.name.givenName,
                familyName: mC.name.familyName,
                phone: phones,
                invited: false
              }
            )
          }
        }, error => {
          this.loading = false
        })


      }

      this.getTeepzr()
    }, error => {
    })
  }


  goToOutcircle() {
    if (this.previousRoute) {
      this.router.navigate(['/tabs/tab1'], {
        replaceUrl: true,
      })
    } else {
      this.router.navigate(['/outcircle'], {
        replaceUrl: true,
      })
    }

  }


  getTeepzr() {
    let list = []
    this.contactService.teepZrs(this.userId).subscribe(res => {
      //  console.log(res)
      this.listTeepZrs = res['data']
      this.contactService.setLocalData(CACHE_KEYS.CONTACTS, this.myContacts);
      this.listContacts = this.getUniquesOnContacts(this.listContacts)
      this.listContacts.forEach(um => {
        this.listTeepZrs.filter((x, index) => {
          for (const p of um.phone) {
            x['phone'].replace(/\s/g, '').slice(-7) == p.replace(/\s/g, '').slice(-7) ?
              list.push({ _id: x['_id'], prenom: um.givenName, nom: um.familyName, phone: x.phone, photo: x.photo }) : null
          }
        })
      });

      this.listTeepZrs = this.getUniquesOnContacts(list)
      this.listTeepZrs.forEach(e => {
        let invitation = { idSender: this.userId, idReceiver: e['_id'] }
        this.contactService.checkInvitationTeepzr(invitation).subscribe(res => {
          if (res['status'] == 201) {
            this.listTeepzrsToInvite.push({ _id: e['_id'], nom: e['nom'], prenom: e['prenom'], phone: e['phone'], photo: e['photo'], invited: true })
          } else {
            if (!this.circleMembersId.includes(e['_id'].toString())) {
              this.listTeepzrsToInvite.push({ _id: e['_id'], nom: e['nom'], prenom: e['prenom'], phone: e['phone'], photo: e['photo'], invited: false })
            }
          }
        })
      });
    }, error => {
      // console.log(error)

    })
  }


  getUsersOfCircle() {
    this.loading = true
    this.contactService.getCircleMembers(this.userId).subscribe(res => {
      let circleMembers = res['data']
      for (const cm of circleMembers) {
        this.circleMembersId.push(cm['_id'])
      }
      //console.log(this.circleMembersId);
      this.loading = false
    }, error => {
      // console.log(error)
      this.loading = false

    })
  }
  getUniqueObject(values) {
    console.log(values)
    let list = []
    var valueArr = values.map((item) => { return item.phone });
    valueArr.some(function (item, idx) {
      var isDuplicate = valueArr.indexOf(item) != idx;
      if (!isDuplicate) {
        list.push(item)
      }
    });
    return list

  }

  sendShare(c) {
    this.socialSharing.share('Bonjour,  ' + '<br>' + "Je vous invite à rejoindre Teepzy. Téléchargez à ce lien", 'TeepZy', null,
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
      //  console.log(res)
      this.presentToast('Invitation envoyée')
      this.listContacts.find((c, index) => {
        let phones = c.phone
        for (const p of phones) {
          return p['value'].replace(/\s/g, '') == phone.replace(/\s/g, '') ? c['invited'] = true : null
        }
      })
    }, error => {
      this.presentToast('Invitation non envoyée')
      // alert(JSON.stringify(error))
    })
  }


  dleteInvitationSmsFromServer(phone) {
    let inviteViaSms = {
      senderId: this.userId,
      phone: phone
    }
    this.contactService.deleteInviteViaSms(inviteViaSms).subscribe(res => {
      // console.log(res)
      this.presentToast('Invitation annulée')
      this.listContacts.find((c, index) => {
        let phones = c.phone
        for (const p of phones) {
          return p['value'].replace(/\s/g, '') == phone.replace(/\s/g, '') ? c['invited'] = false : null
        }
      })
    }, error => {
      this.presentToast('Invitation non annulée')
    })
  }



  sendInvitationToJoinCircle(idReceiver) {
    this.loading = true
    let invitation = {
      idSender: this.userId,
      idReceiver: idReceiver,
      typeLink: typeAccount.pseudoIntime
    }
    this.contactService.inviteToJoinCircle(invitation).subscribe(res => {
      // console.log(res)
      this.listTeepzrsToInvite.find((c, index) => c['_id'] == idReceiver ? c['invited'] = true : null)
      this.presentToast('Invitation envoyée')
      //this.socket.emit('notification', 'notification');
      this.loading = false
    }, error => {
      // alert(JSON.stringify(error))
      this.presentToast('Invitation non envoyée')
      this.loading = false
    })
  }


  cancelInvitationToJoinCircle(u) {
    this.loading = true
    let invitation = {
      idSender: this.userId,
      idReceiver: u._id,
    }

    this.contactService.cancelToJoinCircle(invitation).subscribe(res => {
      //console.log(res)

      if (res['status'] == 400) {
        this.presentToast('Invitation non envoyée')
        this.loading = false

      } else {
        this.listTeepzrsToInvite.find((c, index) => c['_id'] == u._id ? c['invited'] = false : null)
        // console.log(this.listTeepzrsToInvite)
        this.presentToast('Invitation annulée')
        this.loading = false

      }
      //  this.getTeepzr()
    }, error => {
      this.presentToast('Invitation non envoyée')
      this.loading = false

    })
  }

  getUserInfo(userId) {
    this.authService.myInfos(userId).subscribe(res => {
      // console.log(res)
      this.userInfo = res['data'];
      if (this.userInfo['isContactAuthorized'] == true) {
        this.getCachedContacts()
      }
    }, error => {
      // console.log(error)
    })
  }


  async presentAlertConfirm(IdR) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: "Quel type d'invitation voulez-vous envoyer ?",
      message: '',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.presentToast('Annulé')
          }
        },

        {
          text: 'Confirmer',
          handler: () => {
            this.sendInvitationToJoinCircle(IdR)

          }
        }
      ]
    });
    await alert.present();

  }


  goToFeed() {
    this.router.navigateByUrl('/tabs/tab1', {
      replaceUrl: true,
    })
  }

  getTeepzrOutCircle() {
    this.loading = true
    this.contactService.eventualKnownTeepZrs(this.userId).subscribe(res => {
      //  console.log(res)
      this.listTeepZrs = this.listSorter(res['data'])
      this.loading = false
      this.listTeepZrs.forEach(e => {
        let invitation = {
          idSender: this.userId,
          idReceiver: e['_id']
        }
        this.checkInvitationOutCircle(invitation, e)
      });
      //   console.log(this.listTeepZrs)
    }, error => {
      //  console.log(error)
      this.loading = false
      this.presentToast('Oops! Une erreur est survenue sur le serveur')

    })
  }

  checkInvitationOutCircle(invitation, e) {
    this.contactService.checkInvitationTeepzr(invitation).subscribe(res => {
      // console.log(res)
      if (res['status'] == 201) {
        this.listTeepzrsToInviteOutCircle.push(
          {
            _id: e['_id'],
            nom: e['nom'],
            prenom: e['prenom'],
            phone: e['phone'],
            photo: e['photo'],
            invited: true
          },
        )

      } else {
        this.listTeepzrsToInviteOutCircle.push(
          {
            _id: e['_id'],
            nom: e['nom'],
            prenom: e['prenom'],
            phone: e['phone'],
            photo: e['photo'],
            invited: false
          },
        )
      }
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
