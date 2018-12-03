import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {Calendar} from "@ionic-native/calendar";
import { AttendanceCheckinPage } from './attendance-checkin';
import {ScheduleService} from "../../../service/schedule/ScheduleService";
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    AttendanceCheckinPage,
  ],
  imports: [
    IonicPageModule.forChild(AttendanceCheckinPage),
    PipesModule
  ],
  providers:[
    Calendar,ScheduleService,
  ]
})
export class AttendanceCheckinPageModule {}
