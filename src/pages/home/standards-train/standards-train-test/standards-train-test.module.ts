import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StandardsTrainTestPage } from './standards-train-test';
import {StandardsTrainTopicPage} from "../standards-train-topic/standards-train-topic";
import {PipesModule} from "../../../../pipes/pipes.module";
import {DirectivesModule} from "../../../../directives/directives.module";
import {StandardsTrainServices} from "../../../../service/standards-train/StandardsTrainServices";

@NgModule({
  declarations: [
    StandardsTrainTestPage,
    StandardsTrainTopicPage
  ],
  imports: [
    IonicPageModule.forChild(StandardsTrainTestPage),
    PipesModule,
    DirectivesModule
  ],
  providers:[StandardsTrainServices]
})
export class StandardsTrainTestPageModule {}
