import { Component, OnInit } from "@angular/core";
import {
  MenuController,
  AlertController,
  ToastController,
} from "@ionic/angular";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { ContactService } from "../providers/contact.service";
import { AuthService } from "../providers/auth.service";
import { DatapasseService } from "../providers/datapasse.service";
import { MESSAGES } from "../constant/constant";
import { Globals } from "../globals";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-detail-project",
  templateUrl: "./detail-project.page.html",
  styleUrls: ["./detail-project.page.scss"],
})
export class DetailProjectPage implements OnInit {
  project = {
    _id: "",
    nom: "",
    photo: "",
    description: "",
    tags: [],
    userPhoto_url: "",
    userPseudo: "",
    userId: "",
  };

  listProjects = [];
  userId = "";
  showDeleteBtn = false;

  slideOpts = {
    initialSlide: 1,
    speed: 400,
  };

  subscription: Subscription;
  language = "";
  constructor(
    private menuCtrl: MenuController,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private toastController: ToastController,
    private contactService: ContactService,
    private authService: AuthService,
    private router: Router,
    public globals: Globals,
    private translate: TranslateService
  ) {
    this.menuCtrl.close("first");
    this.menuCtrl.swipeGesture(false);
    this.language = localStorage.getItem("teepzyUserLang") || "fr";
    // Set default language
    this.translate.setDefaultLang(this.language);
  }

  ngOnInit() {
    let project = this.route.snapshot.paramMap["params"];
    let tags = project.tags.split(",");
    this.project._id = project._id;
    this.project.nom = project.nom;
    this.project.photo = project.photo;
    this.project.description = project.description;
    this.project.tags = tags;
    this.project.userPhoto_url = project.userPhoto_url;
    this.project.userPseudo = project.userPseudo;
    this.project.userId = project.userId;
    this.userId = localStorage.getItem("teepzyUserId");
    this.userId === project.userId
      ? (this.showDeleteBtn = true)
      : (this.showDeleteBtn = false);
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: this.language === "fr" ? "Supprimer?" : "Delete?",
      message: "",
      buttons: [
        {
          text: this.language === "fr" ? "Non" : "No",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            this.presentToast(this.language === "fr" ? "Annulé" : "Canceled");
          },
        },

        {
          text: this.language === "fr" ? "Oui" : "Yes",
          handler: () => {
            this.delete(this.project._id);
          },
        },
      ],
    });
    await alert.present();
  }

  delete(id) {
    this.subscription = this.contactService.deleteProject(id).subscribe(
      (res) => {
        //  console.log(res)
        this.presentToast(
          this.language === "fr"
            ? MESSAGES.PROJECT_DELETED_OK
            : MESSAGES.PROJECT_DELETED_OK_EN
        );
        this.getUserInfo(this.userId);
      },
      (error) => {
        // console.log(error)
      }
    );
  }

  goToProfile(userId) {
    if (this.userId === userId) {
      this.router.navigate(["/tabs/profile", { userId: userId }]);
    } else {
      this.router.navigate([
        "/profile",
        { userId: userId, previousUrl: "feed" },
      ]);
    }
  }

  getUserInfo(userId) {
    this.subscription = this.authService.myInfos(userId).subscribe(
      (res) => {
        //  console.log(res)
        this.listProjects = res["projects"];
        let navigationExtras: NavigationExtras = {
          state: {
            listProjects: this.listProjects,
          },
        };
        this.router.navigate(["/tabs/profile"], navigationExtras);
      },
      (error) => {
        // console.log(error)
      }
    );
  }

  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null;
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }
}
