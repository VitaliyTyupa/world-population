import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersPanelComponent } from './filters-panel.component';
import { FilterComponent } from './filter/filter.component';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import { FilterPipe } from './filter.pipe';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatIconModule, MatListModule, MatSelectModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatSelectModule
  ],
  exports: [
    FiltersPanelComponent
  ],
  declarations: [FiltersPanelComponent, FilterComponent, FilterPipe]
})
export class FiltersPanelModule { }
