import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkGroupUserPage } from './work-group-user';
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    WorkGroupUserPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkGroupUserPage),
    PipesModule
  ],
})
export class WorkGroupUserPageModule {}
