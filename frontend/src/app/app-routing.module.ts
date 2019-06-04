import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LayoutMainComponent} from './layout-main/layout-main.component';
import {AuthComponent} from './auth/auth.component';

const routes: Routes = [
  {path: '', component: LayoutMainComponent},
  {path: 'auth', component: AuthComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
