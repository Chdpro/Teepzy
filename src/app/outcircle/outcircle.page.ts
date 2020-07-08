import { Component, OnInit } from '@angular/core';
import { ContactService } from '../providers/contact.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-outcircle',
  templateUrl: './outcircle.page.html',
  styleUrls: ['./outcircle.page.scss'],
})
export class OutcirclePage implements OnInit {

  loading = false
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
  listTeepzrsToInvite = []
  userId = ''


  pageIndex: number = 0;
  pageSize: number = 5;
  lowValue: number = 0;
  highValue: number = 5;

  term = ''

  constructor(private contactService: ContactService,
    public toastController: ToastController,
    public router: Router,
    
    ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('teepzyUserId');
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

  goToFeed(){
    this.router.navigate(['/tabs/tab1'], {
      replaceUrl: true,
    })
  }

  getTeepzr() {
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
        this.checkInvitation(invitation, e)
      });
      console.log(this.listTeepZrs)
    }, error => {
      console.log(error)
      this.loading = false
      this.presentToast('Oops! Une erreur est survenue sur le serveur')

    })
  }

  checkInvitation(invitation, e){
    this.contactService.checkInvitationTeepzr(invitation).subscribe(res => {
      console.log(res)
      if (res['status'] == 201) {
        this.listTeepzrsToInvite.push(
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
        this.listTeepzrsToInvite.push(
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
    array.sort((a, b) => a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' }));
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
