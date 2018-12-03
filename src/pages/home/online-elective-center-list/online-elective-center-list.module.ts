import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnlineElectiveCenterListPage } from './online-elective-center-list';

@NgModule({
  declarations: [
    OnlineElectiveCenterListPage,
  ],
  imports: [
    IonicPageModule.forChild(OnlineElectiveCenterListPage),
  ],
})
export class OnlineElectiveCenterListPageModule {}
