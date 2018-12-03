import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnlineStudyListPage } from './online-study-list';
import {MomentModule} from "angular2-moment";
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    OnlineStudyListPage,
  ],
  imports: [
    IonicPageModule.forChild(OnlineStudyListPage),
    MomentModule,
    PipesModule
  ],
})
export class OnlineStudyListPageModule {}
