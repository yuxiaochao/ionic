import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnlineExamResultPage } from './online-exam-result';
import {OnlineExamService} from "../../../../service/online-exam/OnlineExamService";

@NgModule({
  declarations: [
    OnlineExamResultPage,
  ],
  imports: [
    IonicPageModule.forChild(OnlineExamResultPage),
  ],
  providers:[OnlineExamService]
})
export class OnlineExamResultPageModule {}
