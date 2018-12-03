import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnlineExamListPage } from './online-exam-list';
import { MomentModule } from 'angular2-moment'
import {PipesModule} from "../../../../pipes/pipes.module";
@NgModule({
  declarations: [
    OnlineExamListPage,
  ],
  providers : [],
  imports: [
    IonicPageModule.forChild(OnlineExamListPage),
    MomentModule,
    PipesModule
  ],
  exports : [OnlineExamListPage]
})
export class OnlineExamListPageModule {}
