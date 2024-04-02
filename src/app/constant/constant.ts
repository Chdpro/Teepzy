import { Injectable } from "@angular/core";

const language = localStorage.getItem("teepzyUserLang") || "fr";

@Injectable()
export class Variable {
  constructor() {}
}

export const messageShare =
  "Coucou, je t'invite à rejoindre mon cercle sur Teepzy l' l’application la plus évoluée de mise en relation de confiance quand tu recherches une aide, un service, un conseil, ou même la maison de tes rêves \n Chacun de nos contacts a des informations , de bons plans ou de conseils à partager. Et quand tu poses une question dans ton réseau, notre algorithme va chercher les personnes susceptible de pouvoir te répondre. \n- Télécharger l'Appli Android : ";
export enum typeAccount {
  pseudoPro = "PRO",
  pseudoIntime = "AMICAL",
}

export enum type {
  POST = "POST",
  MESSAGE = "MESSAGE",
  PRODUCT = "PRODUCT",
  PROJECT = "PROJECT",
}

export enum CACHE_KEYS {
  CONTACTS = "MY_CONTACTS",
  FEEDS = "FEEDS",
  FEEDS_CHECK = "FEEDS_CHECK",
  NOTIFICATIONS = "NOTIFICATIONS",
  NOTIFICATIONS_MENTION = "NOTIFICATIONS_MENTION",
  PROFILE = "PROFILE",
  CHAT = "CHAT",
  ROOMS = "ROOMS",
  INVITATION_SMS = "INVITATION_SMS",
  INVITATIONS = "INVITATIONS",
  LINKS = "LINKS",
}

export const Online = true;
export const Offline = false;

export enum Icon {
  GRADE = "grade",
  CHAT_BUBBLE = "chat_bubble",
  DYNAMIC_FEED = "dynamic_feed",
  SHARE = "redo",
  MESSAGE = "message",
}

export enum PERMISSION {
  WRITE_EXTERNAL_STORAGE = "WRITE_EXTERNAL_STORAGE",
  READ_EXTERNAL_STORAGE = "READ_EXTERNAL_STORAGE",
  READ_CONTACTS = "READ_CONTACTS",
  WRITE_CONTACTS = "WRITE_CONTACTS",
  CAMERA = "CAMERA",
}

export enum MESSAGES {
  WELCONE_TEXT = "Bienvenue sur ",
  LOGIN_OK = "Connexion réussie",
  LOGIN_INVALID = "Mot de passe ou email incorrect",
  LOGIN_ERROR = "Erreur lors de la connexion",
  PASSWORD_NOT_CORRECT = "L'ancien mot de passe est incorrect",
  LOGOUT_OK = "Vous êtes déconnectés",
  SIGNUP_OK = "Inscription réussie",
  SIGNUP_INVALID = "Mot de passe ou email incorrect",
  SIGNUP_ERROR = "Erreur lors de l'inscription",
  SIGNUP_VALID = "Inscription Validée",
  SIGNUP_EXIST_OK = "Ce compte existe déjà. Vérifier email ou vos pseudos",
  PASSWORD_NOT_MATCH = "le mot de passe et la confirmation ne correspondent pas",
  NO_DATA_FEED = "Aucun post pour le moment",
  FAVORITE_OK = "Ajouté aux favoris",
  REMOVE_FAVORITE_ERROR = "Erreur de la suppression des favoris",
  REMOVE_FAVORITE_OK = "Enlevé des favoris",
  FAVORITE_ERROR = "Erreur lors de la mise en favoris",
  SHARE_OK = "Ce post a été bien partagé",
  SHARE_ERROR = "Erreur lors du partage d'un post dans votre cercle",
  CENSURED_OK = "Ce post a été signalé",
  CENSURED_ERROR = "Erreur lors du signalement",
  ADD_FEED_OK = "Vous avez publiés",
  DELETE_FEED_OK = "Vous avez supprimés le post",
  DELETE_FEED_ERROR = "Erreur lors de la suppression",
  ADD_FEED_ERROR = "Erreur lors de la publication d'un post",
  VIDEO_LIMIT_ERROR = "La durée de la vidéo ne peut dépasser 35s",
  MEDIA_LIMIT_ERROR = "Vous ne pouvez pas sélectionner pluisieurs médias",
  UNABLE_TAKE_PHOTO = "Vous n'avez pas autorisé l'accès à la prise de photo",
  COLOR_CHOSED_OK = "Couleur choisie",
  LINK_DENIED_OK = "Demande refusée",
  LINK_ACCEPTED_OK = "Demande acceptée",
  LINK_THESE_PEOPLE = "Vous avez linké ces personnes",
  POST_ON_FEED = "Publié sur le fil d'actualité",
  INVITATION_ACCEPTED_OK = "Demande d'invitation accpetée",
  INVITATION_SEND_OK = "Demande d'invitation envoyée",
  INVITATION_SEND_ERROR = "Demande d'invitation non envoyée",
  INVITATION_DENIED_OK = "Demande d'invitation refusée",
  ROOM_INITIATED_OK = "Conversation créee",
  PERSON_YET_EXIST_ROOM = "Cette personne appartient déjà à cette discussion",
  ERROR_UPLOAD = "Oops une erreur lors de l'upload",
  ROOM_INITIATED_ERROR = "Erreur lors de la création d'une conversation",
  ROOM_DELETED_OK = "Conversation supprimée",
  ROOM_EXIST_OK = "Cette conversation existe",
  ROOM_UPDATE_OK = "Une nouvelle personne ajoutée à la discussion",
  ROOM_UPDATE_ERROR = "Erreur lors de l'ajout d'une nouvelle personne ",
  ROOM_DELETED_ERROR = "Erreur lors de la suppression de la conversation",
  PROFILE_UPDATED_OK = "Profile mise à jour",
  PASSWORD_UPDATED_OK = "Mot de passe mise à jour",
  PROFILE_UPDATED_ERROR = "Erreur lors de la mise à jour du profile",
  PROJECT_CREATED_OK = "Nouveau projet ajouté",
  PROJECT_DELETED_ERROR = "Erreur lors de la suppression",
  PROJECT_DELETED_OK = "Projet supprimé",
  PROJECT_CREATED_ERROR = "Erreur lors de l'ajout du projet",
  SHOP_CREATED_OK = "Nouveau produit ajouté",
  SHOP_CREATED_ERROR = "Erreur lors de l'ajout du produit",
  SHOP_DELETED_ERROR = "Erreur lors de la suppression du produit",
  SHOP_DELETED_OK = "Produit supprimé",
  CIRCLE_MEMBER_DELETED_OK = "Un membre supprimé de votre cercle",
  CIRCLE_MEMBER_DELETED_ERROR = "Erreur lors de la suppression",
  AUTHO_FEED_NO_MATCH_OK = "Vous ne pouvez pas linker cette publication parce que vous en êtes l'auteur",
  SERVER_ERROR = "Oops! une erreur est survenue sur le serveur",
  REPORT_OK = "Bug signalé",
  SUGGEST_OK = "Suggestion envoyée",
  MEDIA_YET_ADDED = "Ce média a déjà été ajouté ",
  MEMBER_REMOVED_CHAT = "Membre supprimé de la conversation",
  SELECT_MEDIA = "Sélectionner un média",
  GALLERY_CHOICE = "Choisir dans votre galerie",
  CAMERA_CHOICE = "Utiliser la camera",
  EDIT_SECTION_TITLE = "Etes vous sur de vouloir modifier le titre de la rubrique?",
  NOT_AUTH = "Etes-vous sûr ne pas vouloir autoriser?",
  INVITATION_TYPE = "Quel type d'invitation voulez-vous envoyer ?",
  WHY_REPORT_POST = "Pourquoi signalez-vous cette publication ?",

  // English

  LOGIN_OK_EN = "Successful login",
  LOGIN_INVALID_EN = "Incorrect password or email",
  LOGIN_ERROR_EN = "Login error",
  PASSWORD_NOT_CORRECT_EN = "Old password is incorrect",
  LOGOUT_OK_EN = "You are disconnected",
  SIGNUP_OK_EN = "Successful registration",
  SIGNUP_INVALID_EN = "Incorrect password or email",
  SIGNUP_ERROR_EN = "Error when registering",
  SIGNUP_VALID_EN = "Registration Validated",
  SIGNUP_EXIST_OK_EN = "This account already exists. Check your email or usernames",
  PASSWORD_NOT_MATCH_EN = "password and confirmation do not match",
  NO_DATA_FEED_EN = "No post yet",
  FAVORITE_OK_EN = "Added to favorites",
  REMOVE_FAVORITE_ERROR_EN = "Error deleting favorites",
  REMOVE_FAVORITE_OK_EN = "Removed from favourites",
  FAVORITE_ERROR_EN = "Error while bookmarking",
  SHARE_OK_EN = "This post has been successfully shared",
  SHARE_ERROR_EN = "Error sharing a post in your circle",
  CENSURED_OK_EN = "This post has been reported",
  CENSURED_ERROR_EN = "Error reporting",
  ADD_FEED_OK_EN = "You posted successfully",
  DELETE_FEED_OK_EN = "You have deleted the post",
  DELETE_FEED_ERROR_EN = "Error while deleting",
  ADD_FEED_ERROR_EN = "Error publishing a post",
  VIDEO_LIMIT_ERROR_EN = "Video duration cannot exceed 35s",
  MEDIA_LIMIT_ERROR_EN = "You cannot select multiple media",
  UNABLE_TAKE_PHOTO_EN = "You have not authorised access to take a photo",
  COLOR_CHOSED_OK_EN = "Selected colour",
  LINK_DENIED_OK_EN = "Request denied",
  LINK_ACCEPTED_OK_EN = "Request accepted",
  LINK_THESE_PEOPLE_EN = "You have linked these people",
  INVITATION_ACCEPTED_OK_EN = "Invitation request accepted",
  INVITATION_SEND_OK_EN = "Invitation request sent",
  INVITATION_SEND_ERROR_EN = "Invitation request not sent",
  INVITATION_DENIED_OK_EN = "Invitation request refused",
  ROOM_INITIATED_OK_EN = "Conversation created",
  ERROR_UPLOAD_EN = "Oops an error during upload",
  ROOM_INITIATED_ERROR_EN = "Error while creating a conversation",
  ROOM_DELETED_OK_EN = "Conversation deleted",
  ROOM_EXIST_OK_EN = "This conversation exists",
  ROOM_UPDATE_OK_EN = "A new person added to the discussion",
  PERSON_YET_EXIST_ROOM_EN = "This person already belongs to this discussion",
  ROOM_UPDATE_ERROR_EN = "Error adding new person",
  ROOM_DELETED_ERROR_EN = "Error deleting the conversation",
  PROFILE_UPDATED_OK_EN = "Profile updated",
  PASSWORD_UPDATED_OK_EN = "Password updated",
  PROFILE_UPDATED_ERROR_EN = "Error while updating profile",
  PROJECT_CREATED_OK_EN = "New project added",
  PROJECT_DELETED_ERROR_EN = "Error while deleting",
  PROJECT_DELETED_OK_EN = "Project deleted",
  PROJECT_CREATED_ERROR_EN = "Error adding project",
  POST_ON_FEED_EN = "Published on the news feed",
  SHOP_CREATED_OK_EN = "New product added",
  SHOP_CREATED_ERROR_EN = "Error adding product",
  SHOP_DELETED_ERROR_EN = "Error while deleting the product",
  SHOP_DELETED_OK_EN = "Product deleted",
  CIRCLE_MEMBER_DELETED_OK_EN = "A member deleted from your circle",
  CIRCLE_MEMBER_DELETED_ERROR_EN = "Error while deleting",
  AUTHO_FEED_NO_MATCH_OK_EN = "You cannot link this publication because you are the author",
  SERVER_ERROR_EN = "Oops! An error occurred on the server",
  REPORT_OK_EN = "Bug reported",
  SUGGEST_OK_EN = "Suggestion sent",
  MEDIA_YET_ADDED_EN = "This social media already added ",
  MEMBER_REMOVED_CHAT_EN = "Member deleted from the chat",

  SELECT_MEDIA_EN = "Select a media",
  GALLERY_CHOICE_EN = "Choose from your gallery",
  CAMERA_CHOICE_EN = "Use camera",
  EDIT_SECTION_TITLE_EN = "Are you sure you want to change the title of the section?",
  NOT_AUTH_EN = "Are you sure you don't want to allow?",
  INVITATION_TYPE_EN = "What type of invitation do you want to send?",
  WHY_REPORT_POST_EN = "Why are you reporting this publication?",
}
