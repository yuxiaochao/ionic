import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskdetailPage } from './taskdetail';
import {PipesModule} from "../../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    TaskdetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskdetailPage),
    PipesModule
  ],
})
export class TaskdetailPageModule {}
