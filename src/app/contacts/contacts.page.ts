import { Component, OnInit } from '@angular/core';
import { Contacts } from '@ionic-native/contacts/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { ContactService } from '../providers/contact.service';
import { ToastController, AlertController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {

  myContacts = []
  listTeepzrsToInvite = []
  listTeepzrsToInviteOutCircle = []
  listContacts = []
  listTeepZrs = []
  contactsTest = [
    {
      givenName: 'Chris',
      familyName: 'Placktor',
      phone: '98148917',
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
      givenName: 'Ridy',
      familyName: 'FRANCE',
      phone: '+330663534043',
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
  contactsTests = []
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
  constructor(private contacts: Contacts, private sms: SMS,
    public toastController: ToastController,
    private socialSharing: SocialSharing,
    public router: Router,
    public route: ActivatedRoute,
    private socket : Socket,
    public alertController: AlertController,
    private contactService: ContactService) { 
     this.previousRoute = this.route.snapshot.paramMap.get('previousUrl')
      console.log(this.previousRoute)
     }

  ngOnInit() {
    this.userId = localStorage.getItem('teepzyUserId');
    this.userPhone = localStorage.getItem('teepzyPhone')
    this.connectSocket()
    this.loadContacts()
    let a = '66 77 23 27'
    let b = '+22966772327'
    console.log(a.replace(/\s/g, '').slice(-7) == b.replace(/\s/g, '').slice(-7) ? true : false)
    //this.getTeepzr()
    this.getTeepzrOutCircle()
  }

  connectSocket(){
    this.socket.connect();
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
          console.log("Swipe left - INDEX: " + this.selectedTab);
        } else if (swipe === 'previous') {
          const isLast = this.selectedTab === 3;
          if (this.selectedTab >= 1) {
            this.selectedTab = this.selectedTab - 1;
          }
          console.log("Swipe right — INDEX: " + this.selectedTab);
        }
        // Do whatever you want with swipe
      }
    }
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
      for (const mC of this.myContacts) {
        // set loading on list
        if (this.listContacts.length < this.myContacts.length) {
          this.loading = true;
        }else if(this.listContacts.length == this.myContacts.length){
          this.loading = false

        }
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
    }else{
      this.router.navigate(['/outcircle'], {
        replaceUrl: true,
      })
    }

  }


  getTeepzr() {
    let list = []
    this.contactService.teepZrs(this.userId).subscribe(res => {
      console.log(res)
      this.listTeepZrs = res['data']
      this.listContacts.forEach(um => {
        this.listTeepZrs.filter((x, index) => { x['phone'].replace(/\s/g, '').slice(-7) == um.phone.replace(/\s/g, '').slice(-7) ? list.push({ _id: x['_id'], prenom: um.givenName, nom: um.familyName, phone: x.phone, photo: x.photo }) : null })
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



  sendInvitationToJoinCircle(idReceiver, typeLink) {
    console.log(idReceiver)
    this.loading = true
    let invitation = {
      idSender: this.userId,
      idReceiver: idReceiver,
      typeLink: typeLink
    }
    this.contactService.inviteToJoinCircle(invitation).subscribe(res => {
      console.log(res)
      this.listTeepzrsToInvite.find((c, index) => c['_id'] == idReceiver ? c['invited'] = true : null)
      this.presentToast('Invitation envoyée')
      this.socket.emit('notification', 'notification');
      console.log(this.listTeepzrsToInvite)
      this.loading = false
    }, error => {
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
      console.log(res)

      if (res['status'] == 400) {
      this.presentToast('Invitation non envoyée')
      this.loading = false

      }else{
        this.listTeepzrsToInvite.find((c, index) => c['_id'] == u._id ? c['invited'] = false : null)
        console.log(this.listTeepzrsToInvite)
        this.presentToast('Invitation annulée')
        this.loading = false

      }
      //  this.getTeepzr()
    }, error => {
      this.presentToast('Invitation non envoyée')
      this.loading = false

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
          text: 'Professionnelle',
          handler: () => {
            let typeLink = 'PRO'
            this.sendInvitationToJoinCircle(IdR, typeLink)
          }
        },

        {
          text: 'Amicale',
          handler: () => {
            let typeLink = 'AMICAL'
            this.sendInvitationToJoinCircle(IdR, typeLink)

          }
        }
      ]
    });
    await alert.present();

  }


  goToFeed(){
    this.router.navigateByUrl('/tabs/tab1', {
      replaceUrl: true,
    })
  }

  getTeepzrOutCircle() {
    this.loading = true
    this.contactService.eventualKnownTeepZrs(this.userId).subscribe(res => {
      console.log(res)
      this.listTeepZrs = this.listSorter(res['data'])
      this.loading = false
      this.listTeepZrs.forEach(e => {
        let invitation = {
          idSender: this.userId,
          idReceiver: e['_id']
        }
        this.checkInvitationOutCircle(invitation, e)
      });
      console.log(this.listTeepZrs)
    }, error => {
      console.log(error)
      this.loading = false
      this.presentToast('Oops! Une erreur est survenue sur le serveur')

    })
  }

  checkInvitationOutCircle(invitation, e){
    this.contactService.checkInvitationTeepzr(invitation).subscribe(res => {
      console.log(res)
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
