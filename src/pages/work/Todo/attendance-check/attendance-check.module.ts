import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttendanceCheckPage } from './attendance-check';

@NgModule({
  declarations: [
    AttendanceCheckPage,
  ],
  imports: [
    IonicPageModule.forChild(AttendanceCheckPage),
  ],
})
export class AttendanceCheckPageModule {}
