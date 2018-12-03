import {NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkGroupPage } from './work-group';
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    WorkGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkGroupPage),
    PipesModule
  ],
})
export class WorkGroupPageModule {}
