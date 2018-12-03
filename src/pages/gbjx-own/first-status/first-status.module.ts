import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FirstStatusPage } from './first-status';

@NgModule({
  declarations: [
    FirstStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(FirstStatusPage),
  ],
})
export class FirstStatusPageModule {}
