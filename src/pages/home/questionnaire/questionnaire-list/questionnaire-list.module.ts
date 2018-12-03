import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionnaireListPage } from './questionnaire-list';
import {PipesModule} from "../../../../pipes/pipes.module";
import {MomentModule} from "angular2-moment";

@NgModule({
  declarations: [
    QuestionnaireListPage,
  ],
  imports: [
    IonicPageModule.forChild(QuestionnaireListPage),
    MomentModule,
    PipesModule
  ],
})
export class QuestionnaireListPageModule {}
