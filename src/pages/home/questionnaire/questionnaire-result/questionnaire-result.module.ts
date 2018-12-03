import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {QuestionnaireResultPage} from "./questionnaire-result";
import {OnlineQuestionnaireService} from "../../../../service/online-questionnaire/OnlineQuestionnaireService";
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    QuestionnaireResultPage,
  ],
  imports: [
    IonicPageModule.forChild(QuestionnaireResultPage),
    PipesModule
  ],
  providers:[OnlineQuestionnaireService]
})
export class QuestionnaireResultPageModule {}
