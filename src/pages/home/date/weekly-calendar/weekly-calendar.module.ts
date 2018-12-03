import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeeklyCalendarPage } from './weekly-calendar';

@NgModule({
  declarations: [
    WeeklyCalendarPage,
  ],
  imports: [
    IonicPageModule.forChild(WeeklyCalendarPage),
  ],
})
export class WeeklyCalendarPageModule {}
