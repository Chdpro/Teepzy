import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'debut',
    loadChildren: () => import('./debut/debut.module').then( m => m.DebutPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'contacts',
    loadChildren: () => import('./contacts/contacts.module').then( m => m.ContactsPageModule)
  },
  {
    path: 'link',
    loadChildren: () => import('./link/link.module').then( m => m.LinkPageModule)
  },
  {
    path: 'outcircle',
    loadChildren: () => import('./outcircle/outcircle.module').then( m => m.OutcirclePageModule)
  },
  {
    path: 'signup-final',
    loadChildren: () => import('./signup-final/signup-final.module').then( m => m.SignupFinalPageModule)
  },
  {
    path: 'add-post',
    loadChildren: () => import('./add-post/add-post.module').then( m => m.AddPostPageModule)
  },

  {
    path: 'comments',
    loadChildren: () => import('./comments/comments.module').then( m => m.CommentsPageModule)
  },
  {
    path: 'link-sheet',
    loadChildren: () => import('./link-sheet/link-sheet.module').then( m => m.LinkSheetPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'add-project',
    loadChildren: () => import('./add-project/add-project.module').then( m => m.AddProjectPageModule)
  },
  {
    path: 'add-product',
    loadChildren: () => import('./add-product/add-product.module').then( m => m.AddProductPageModule)
  },
  {
    path: 'detail-project',
    loadChildren: () => import('./detail-project/detail-project.module').then( m => m.DetailProjectPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'detail-feed',
    loadChildren: () => import('./detail-feed/detail-feed.module').then( m => m.DetailFeedPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'circle-members',
    loadChildren: () => import('./circle-members/circle-members.module').then( m => m.CircleMembersPageModule)
  },
  {
    path: 'share-sheet',
    loadChildren: () => import('./share-sheet/share-sheet.module').then( m => m.ShareSheetPageModule)
  },
  {
    path: 'edit-post',
    loadChildren: () => import('./edit-post/edit-post.module').then( m => m.EditPostPageModule)
  },
  
  {
    path: 'detail-produit',
    loadChildren: () => import('./detail-produit/detail-produit.module').then( m => m.DetailProduitPageModule)
  },
  {
    path: 'friends',
    loadChildren: () => import('./friends/friends.module').then( m => m.FriendsPageModule)
  },
  {
    path: 'add-people-room',
    loadChildren: () => import('./add-people-room/add-people-room.module').then( m => m.AddPeopleRoomPageModule)
  },
  {
    path: 'edit-info',
    loadChildren: () => import('./edit-info/edit-info.module').then( m => m.EditInfoPageModule)
  },
  {
    path: 'edit-pass',
    loadChildren: () => import('./edit-pass/edit-pass.module').then( m => m.EditPassPageModule)
  },
  {
    path: 'report-bug',
    loadChildren: () => import('./report-bug/report-bug.module').then( m => m.ReportBugPageModule)
  },
  {
    path: 'suggest',
    loadChildren: () => import('./suggest/suggest.module').then( m => m.SuggestPageModule)
  },
  {
    path: 'autorisation',
    loadChildren: () => import('./autorisation/autorisation.module').then( m => m.AutorisationPageModule)
  },
  {
    path: 'privacy',
    loadChildren: () => import('./privacy/privacy.module').then( m => m.PrivacyPageModule)
  },
  {
    path: 'conditions',
    loadChildren: () => import('./conditions/conditions.module').then( m => m.ConditionsPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },

  {
    path: 'forgot-pass',
    loadChildren: () => import('./forgot-pass/forgot-pass.module').then( m => m.ForgotPassPageModule)
  },
  {
    path: 'group-invitation',
    loadChildren: () => import('./group-invitation/group-invitation.module').then( m => m.GroupInvitationPageModule)
  },
  {
    path: 'tuto-video',
    loadChildren: () => import('./tuto-video/tuto-video.module').then( m => m.TutoVideoPageModule)
  },
  {
    path: 'feed',
    loadChildren: () => import('./feed/feed.module').then( m => m.FeedPageModule)
  },
  {
    path: 'permissions',
    loadChildren: () => import('./permissions/permissions.module').then( m => m.PermissionsPageModule)
  },
  {
    path: 'robot-alert',
    loadChildren: () => import('./robot-alert/robot-alert.module').then( m => m.RobotAlertPageModule)
  },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
