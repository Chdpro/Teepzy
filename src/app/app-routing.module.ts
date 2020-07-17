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
    path: 'bottom-sheet-overview-example-sheet',
    loadChildren: () => import('./bottom-sheet-overview-example-sheet/bottom-sheet-overview-example-sheet.module').then( m => m.BottomSheetOverviewExampleSheetPageModule)
  },
  {
    path: 'comments',
    loadChildren: () => import('./comments/comments.module').then( m => m.CommentsPageModule)
  },
  {
    path: 'link-sheet',
    loadChildren: () => import('./link-sheet/link-sheet.module').then( m => m.LinkSheetPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
