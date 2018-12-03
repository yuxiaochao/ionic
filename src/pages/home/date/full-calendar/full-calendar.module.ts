import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FullCalendarPage } from './full-calendar';

@NgModule({
  declarations: [
    FullCalendarPage,
  ],
  imports: [
    IonicPageModule.forChild(FullCalendarPage),
  ],
})
export class FullCalendarPageModule {}
