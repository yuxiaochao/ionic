import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExamExercisesDetailPage } from './exam-exercises-detail';
import {ExamExercisesService} from "../../../../service/exam-exercises/ExamExercisesService";

@NgModule({
  declarations: [
    ExamExercisesDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ExamExercisesDetailPage),
  ],
  providers:[
    ExamExercisesService
  ]
})
export class ExamExercisesDetailPageModule {}
