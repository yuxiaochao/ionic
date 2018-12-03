import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DormitoryDetailsPage } from './dormitory-details';

@NgModule({
  declarations: [
    DormitoryDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(DormitoryDetailsPage),
  ],
})
export class DormitoryDetailsPageModule {}
