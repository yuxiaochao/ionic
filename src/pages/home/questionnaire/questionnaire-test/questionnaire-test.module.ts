import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionnaireTestPage } from './questionnaire-test';
import { OnlineQuestionnaireService} from "../../../../service/online-questionnaire/OnlineQuestionnaireService";
import { PipesModule} from "../../../../pipes/pipes.module";
import { DirectivesModule} from "../../../../directives/directives.module";
import {QuestionnaireTopicComponent} from "../questionnaire-topic/questionnaire-topic";

@NgModule({
  declarations: [
    QuestionnaireTestPage,
    QuestionnaireTopicComponent,
  ],
  providers:[OnlineQuestionnaireService],
  imports: [
    IonicPageModule.forChild(QuestionnaireTestPage),
    PipesModule,
    DirectivesModule
  ],
})
export class QuestionnaireTestPageModule {}
