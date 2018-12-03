import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckinDetailsPage } from './checkin-details';
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    CheckinDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckinDetailsPage),
    PipesModule
  ],
})
export class CheckinDetailsPageModule {}
