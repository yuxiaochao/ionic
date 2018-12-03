import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionnaireMyresultPage } from './questionnaire-myresult';
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    QuestionnaireMyresultPage,
  ],
  imports: [
    IonicPageModule.forChild(QuestionnaireMyresultPage),
    PipesModule
  ],
})
export class QuestionnaireMyresultPageModule {}
