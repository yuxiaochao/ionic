import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DatePage } from './date';
import {Calendar} from "@ionic-native/calendar";
import {ScheduleService} from "../../../service/schedule/ScheduleService";
import { AbsoluteDragDirective } from '../../../directives/absolute-drag/absolute-drag';
import {PipesModule} from "../../../pipes/pipes.module";


@NgModule({
  declarations: [
    DatePage,AbsoluteDragDirective
  ],
  imports: [
    IonicPageModule.forChild(DatePage),
    PipesModule
  ],

  providers:[
    Calendar,ScheduleService,
  ]


})
export class DatePageModule {}
