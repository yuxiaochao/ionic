import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CanteenDetailsPage } from './canteen-details';

@NgModule({
  declarations: [
    CanteenDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CanteenDetailsPage),
  ],
})
export class CanteenDetailsPageModule {}
