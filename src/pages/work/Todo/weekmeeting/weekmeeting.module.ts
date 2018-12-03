import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeekmeetingPage } from './weekmeeting';

@NgModule({
  declarations: [
    WeekmeetingPage,
  ],
  imports: [
    IonicPageModule.forChild(WeekmeetingPage),
  ],
})
export class WeekmeetingPageModule {}
