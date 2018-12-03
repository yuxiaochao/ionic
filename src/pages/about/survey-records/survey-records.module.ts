import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SurveyRecordsPage } from './survey-records';
import {PipesModule} from "../../../pipes/pipes.module";


@NgModule({
  declarations: [
    SurveyRecordsPage,
  ],
  imports: [
    IonicPageModule.forChild(SurveyRecordsPage),
    PipesModule
  ],
})
export class SurveyRecordsPageModule {}
