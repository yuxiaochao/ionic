import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrainingCourseListPage } from './training-course-list';

@NgModule({
  declarations: [
    TrainingCourseListPage,
  ],
  imports: [
    IonicPageModule.forChild(TrainingCourseListPage),
  ],
})
export class TrainingCourseListPageModule {}
