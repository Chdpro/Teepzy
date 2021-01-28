import { Injectable } from '@angular/core'

@Injectable()
export class Variable {
   

    constructor(){

    }
}

export enum typeAccount {
    pseudoPro = "PRO",
    pseudoIntime = "AMICAL"

}


export enum type {
    POST = "POST",
    MESSAGE = "MESSAGE",

}


export enum CACHE_KEYS {
    CONTACTS = "MY_CONTACTS",
    FEEDS = "FEEDS",
    NOTIFICATIONS = "NOTIFICATIONS",
    PROFILE = "PROFILE",


}

export const Online = true
export const Offline = false

export enum Icon {
    GRADE = "grade",
    CHAT_BUBBLE = "chat_bubble",
    DYNAMIC_FEED =  "dynamic_feed",
    SHARE = "redo",
    MESSAGE = "message"
}

export enum MESSAGES {
    LOGIN_OK = "Connexion réussie",
    LOGIN_INVALID = "Mot de passe ou email incorrect",
    LOGIN_ERROR = "Erreur lors de la connexion",
    PASSWORD_NOT_CORRECT = "L'ancien mot de passe est incorrect",
    LOGOUT_OK = "Vous êtes déconnectés",
    SIGNUP_OK = "Inscription réussie",
    SIGNUP_INVALID = "Mot de passe ou email incorrect",
    SIGNUP_ERROR = "Erreur lors de l'inscription",
    SIGNUP_VALID = "Inscription Validée",
    SIGNUP_EXIST_OK="Ce compte existe déjà. Vérifier email ou vos pseudos",
    PASSWORD_NOT_MATCH="le mot de passe et la confirmation ne correspondent pas",
    NO_DATA_FEED = "Aucun post pour le moment",
    FAVORITE_OK = "Ajouté aux favoris",
    REMOVE_FAVORITE_ERROR = "Erreur de la suppression des favoris",
    REMOVE_FAVORITE_OK = "Enlevé des favoris",
    FAVORITE_ERROR = "Erreur lors de la mise en favoris",
    SHARE_OK = "Ce post a été bien partagé",
    SHARE_ERROR ="Erreur lors du partage d'un post dans votre cercle",
    CENSURED_OK ="Ce post a été signalé",
    CENSURED_ERROR = "Erreur lors du signalement",
    ADD_FEED_OK="Vous avez publiés",
    DELETE_FEED_OK="Vous avez supprimés le post",
    DELETE_FEED_ERROR="Erreur lors de la suppression",
    ADD_FEED_ERROR="Erreur lors de la publication d'un post",
    VIDEO_LIMIT_ERROR ="La durée de la vidéo ne peut dépasser 15s",
    MEDIA_LIMIT_ERROR ="Vous ne pouvez pas sélectionner pluisieurs médias",
    COLOR_CHOSED_OK = "Couleur choisie",
    LINK_DENIED_OK="Demande refusée",
    LINK_ACCEPTED_OK="Demande acceptée",
    INVITATION_ACCEPTED_OK="Demande d'invitation accpetée",
    INVITATION_SEND_OK="Demande d'invitation envoyée",
    INVITATION_SEND_ERROR="Demande d'invitation non envoyée",
    INVITATION_DENIED_OK="Demande d'invitation refusée",
    ROOM_INITIATED_OK="Conversation créee",
    ROOM_INITIATED_ERROR="Erreur lors de la création d'une conversation",
    ROOM_DELETED_OK="Conversation supprimée",
    ROOM_EXIST_OK="Cette conversation existe",
    ROOM_UPDATE_OK="Une nouvelle personne ajoutée à la discussion",
    ROOM_UPDATE_ERROR="Erreur lors de l'ajout d'une nouvelle personne ",
    ROOM_DELETED_ERROR="Erreur lors de la suppression de la conversation",
    PROFILE_UPDATED_OK="Profile mise à jour",
    PASSWORD_UPDATED_OK="Mot de passe mise à jour",
    PROFILE_UPDATED_ERROR="Erreur lors de la mise à jour du profile",
    PROJECT_CREATED_OK="Nouveau projet ajouté",
    PROJECT_DELETED_ERROR="Erreur lors de la suppression",
    PROJECT_DELETED_OK="Projet supprimé",
    PROJECT_CREATED_ERROR="Erreur lors de l'ajout du projet",
    SHOP_CREATED_OK="Nouveau produit ajouté",
    SHOP_CREATED_ERROR="Erreur lors de l'ajout du produit",
    SHOP_DELETED_ERROR="Erreur lors de la suppression du produit",
    SHOP_DELETED_OK="Produit supprimé",
    CIRCLE_MEMBER_DELETED_OK="Un membre supprimé de votre cercle",
    CIRCLE_MEMBER_DELETED_ERROR="Erreur lors de la suppression",
    AUTHO_FEED_NO_MATCH_OK="Vous ne pouvez pas linker cette publication parce que vous en êtes l'auteur",
    SERVER_ERROR="Oops! une erreur est survenue sur le serveur",
    REPORT_OK="Bug signalé",
    SUGGEST_OK="Suggestion envoyée",


}

