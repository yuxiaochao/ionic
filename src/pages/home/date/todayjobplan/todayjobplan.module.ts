import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TodayjobplanPage } from './todayjobplan';
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    TodayjobplanPage,
  ],
  imports: [
    IonicPageModule.forChild(TodayjobplanPage),
    PipesModule
  ],
})
export class TodayjobplanPageModule {}
