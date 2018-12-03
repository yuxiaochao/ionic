import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {Calendar} from "@ionic-native/calendar";
import {AbsoluteDragDirective} from "../../../../directives/absolute-drag/absolute-drag";
import {KechengbiaoPage} from "./kechengbiao";
import {PipesModule} from "../../../../pipes/pipes.module";
import {ScheduleService} from "../../../../service/schedule/ScheduleService";


@NgModule({
  declarations: [
    KechengbiaoPage,AbsoluteDragDirective
  ],
  imports: [
    IonicPageModule.forChild(KechengbiaoPage),
    PipesModule
  ],

  providers:[
    Calendar,ScheduleService,
  ]


})
export class DatePageModule {}
