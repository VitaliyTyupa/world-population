import {NgModule} from '@angular/core';
import {CoreServicesModule} from './core-services/core-services.module';
import {NotificationModule} from './notification/notification.module';
import {FiltersPanelModule} from './filters-panel/filters-panel.module';


@NgModule ({
  imports: [
    CoreServicesModule,
    NotificationModule,
    FiltersPanelModule
  ],
  exports: [
    CoreServicesModule,
    NotificationModule,
    FiltersPanelModule
],
  declarations: []
})

export class SharedModule {

}
