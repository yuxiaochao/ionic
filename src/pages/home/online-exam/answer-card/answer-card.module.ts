import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnswerCardPage } from './answer-card';

@NgModule({
  declarations: [
    AnswerCardPage,
  ],
  imports: [
    IonicPageModule.forChild(AnswerCardPage),
  ],
})
export class AnswerCardPageModule {}
