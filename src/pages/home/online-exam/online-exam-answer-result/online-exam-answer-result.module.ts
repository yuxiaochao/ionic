import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnlineExamAnswerResultPage } from './online-exam-answer-result';
import {OnlineExamTopicAnswerResultPage} from "../online-exam-topic-answer-result/online-exam-topic-answer-result";
import {OnlineExamService} from "../../../../service/online-exam/OnlineExamService";
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    OnlineExamAnswerResultPage,
    OnlineExamTopicAnswerResultPage
  ],
  providers:[OnlineExamService],
  imports: [
    IonicPageModule.forChild(OnlineExamAnswerResultPage),
    PipesModule
  ],
})
export class OnlineExamAnswerResultPageModule {}
