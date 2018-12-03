import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlacerenwPage } from './placerenw';
import {ScheduleService} from "../../../../../service/schedule/ScheduleService";
import {HighlightDirective} from "../../../../../directives/slide-directive/slide.directive";

@NgModule({
  declarations: [
    PlacerenwPage,
    HighlightDirective
  ],
  imports: [
    IonicPageModule.forChild(PlacerenwPage),
  ],
  providers:[
    ScheduleService,
  ],

  exports: [
    HighlightDirective
  ]
})
export class PlacerenwPageModule {}
