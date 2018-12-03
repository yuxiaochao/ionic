import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExamExercisesTestPage } from './exam-exercises-test';
import {ExamExercisesService} from "../../../../service/exam-exercises/ExamExercisesService";
import {ExamExercisesTopicPage} from "../exam-exercises-topic/exam-exercises-topic";
import {PipesModule} from "../../../../pipes/pipes.module";
import {DirectivesModule} from "../../../../directives/directives.module";
import {MomentModule} from "angular2-moment";

@NgModule({
  declarations: [
    ExamExercisesTestPage,
    ExamExercisesTopicPage
  ],
  imports: [
    IonicPageModule.forChild(ExamExercisesTestPage),
    PipesModule,
    DirectivesModule,
    MomentModule
  ],
  providers:[
    ExamExercisesService
  ]
})
export class ExamExercisesTestPageModule {}
