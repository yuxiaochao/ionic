import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StandardsTrainListPage } from './standards-train-list';
import {MomentModule} from "angular2-moment";
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    StandardsTrainListPage,
  ],
  imports: [
    IonicPageModule.forChild(StandardsTrainListPage),
    MomentModule,
    PipesModule
  ],
})
export class StandardsTrainListPageModule {}
