import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnlineStudyMainPage } from './online-study-main';
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    OnlineStudyMainPage,
  ],
  imports: [
    IonicPageModule.forChild(OnlineStudyMainPage),
    PipesModule
  ],
})
export class OnlineStudyMainPageModule {}
