import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConferencelistPage } from './conferencelist';

@NgModule({
  declarations: [
    ConferencelistPage,
  ],
  imports: [
    IonicPageModule.forChild(ConferencelistPage),
  ],
})
export class ConferencelistPageModule {}
