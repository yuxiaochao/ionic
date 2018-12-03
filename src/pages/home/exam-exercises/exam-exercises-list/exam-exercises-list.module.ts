import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExamExercisesListPage } from './exam-exercises-list';
import {ExamExercisesService} from "../../../../service/exam-exercises/ExamExercisesService";
import {MomentModule} from "angular2-moment";
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    ExamExercisesListPage,
  ],
  imports: [
    IonicPageModule.forChild(ExamExercisesListPage),
    MomentModule,
    PipesModule
  ],
  providers:[
    ExamExercisesService
  ]
})
export class ExamExercisesListPageModule {}
