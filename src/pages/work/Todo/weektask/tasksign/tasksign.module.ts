import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TasksignPage } from './tasksign';

@NgModule({
  declarations: [
    TasksignPage,
  ],
  imports: [
    IonicPageModule.forChild(TasksignPage),
  ],
})
export class TasksignPageModule {}
