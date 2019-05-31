import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LayoutMainComponent} from './layout-main/layout-main.component';

const routes: Routes = [
  {path: '', component: LayoutMainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
