import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnlineExamDetailPage } from './online-exam-detail';
import {OnlineExamService} from "../../../../service/online-exam/OnlineExamService";

@NgModule({
  declarations: [
    OnlineExamDetailPage,
  ],
  providers : [OnlineExamService],
  imports: [
    IonicPageModule.forChild(OnlineExamDetailPage),
  ],
})
export class OnlineExamDetailPageModule {}
