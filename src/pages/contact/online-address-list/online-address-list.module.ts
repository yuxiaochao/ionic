import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnlineAddressListPage } from './online-address-list';

@NgModule({
  declarations: [
    OnlineAddressListPage,
  ],
  imports: [
    IonicPageModule.forChild(OnlineAddressListPage),
  ],
})
export class OnlineAddressListPageModule {}
