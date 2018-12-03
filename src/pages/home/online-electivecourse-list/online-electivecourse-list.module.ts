import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnlineElectivecourseListPage } from './online-electivecourse-list';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    OnlineElectivecourseListPage,
  ],
  imports: [
    IonicPageModule.forChild(OnlineElectivecourseListPage),
    PipesModule
  ],
})
export class OnlineElectivecourseListPageModule {}
