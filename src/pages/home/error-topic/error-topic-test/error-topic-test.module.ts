import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ErrorTopicTestPage } from './error-topic-test';
import {ErrorTopicService} from "../../../../service/error-topic/ErrorTopicService";
import {ErrorTopicTopicPage} from "../error-topic-topic/error-topic-topic";
import {MomentModule} from "angular2-moment";
import {PipesModule} from "../../../../pipes/pipes.module";
import {DirectivesModule} from "../../../../directives/directives.module";
import {ExamExercisesService} from "../../../../service/exam-exercises/ExamExercisesService";

@NgModule({
  declarations: [
    ErrorTopicTestPage,
    ErrorTopicTopicPage
  ],
  imports: [
    IonicPageModule.forChild(ErrorTopicTestPage),
    PipesModule,
    DirectivesModule,
    MomentModule
  ],
  providers:[
    ErrorTopicService,
    ExamExercisesService
  ]
})
export class ErrorTopicTestPageModule {}
