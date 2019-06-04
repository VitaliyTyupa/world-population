import {NgModule} from '@angular/core';
import {CoreServicesModule} from './core-services/core-services.module';
import {NotificationModule} from './notification/notification.module';


@NgModule ({
  imports: [
    CoreServicesModule,
    NotificationModule
  ],
  exports: [
    CoreServicesModule,
    NotificationModule
],
  declarations: []
})

export class SharedModule {

}
