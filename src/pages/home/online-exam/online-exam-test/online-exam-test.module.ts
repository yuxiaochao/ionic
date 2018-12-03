import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnlineExamTestPage } from './online-exam-test';
import {OnlineExamTopicComponent} from "../online-exam-topic/online-exam-topic";
import {OnlineExamService} from "../../../../service/online-exam/OnlineExamService";
import {PipesModule} from "../../../../pipes/pipes.module";
import {DirectivesModule} from "../../../../directives/directives.module";

@NgModule({
  declarations: [
    OnlineExamTestPage,
    OnlineExamTopicComponent
  ],
  providers:[OnlineExamService],
  imports: [
    IonicPageModule.forChild(OnlineExamTestPage),
    PipesModule,
    DirectivesModule
  ],
})
export class OnlineExamTestPageModule {}
