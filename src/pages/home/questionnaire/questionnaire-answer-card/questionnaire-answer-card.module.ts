import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionnaireAnswerCardPage } from './questionnaire-answer-card';

@NgModule({
  declarations: [
    QuestionnaireAnswerCardPage,
  ],
  imports: [
    IonicPageModule.forChild(QuestionnaireAnswerCardPage),
  ],
})
export class AnswerCardPageModule {}
