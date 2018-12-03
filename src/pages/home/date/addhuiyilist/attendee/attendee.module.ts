import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttendeePage } from './attendee';

@NgModule({
  declarations: [
    AttendeePage,
  ],
  imports: [
    IonicPageModule.forChild(AttendeePage),
  ],
})
export class AttendeePageModule {}
