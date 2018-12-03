import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {OutsideSigninPage} from "./outsideSignin";

@NgModule({
  declarations: [
    OutsideSigninPage,
  ],
  imports: [
    IonicPageModule.forChild(OutsideSigninPage),
  ],
})
export class TasksignPageModule {}
