import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {QuestionnaireMorePopoverPage} from "./questionnaire-more-popover";

@NgModule({
  declarations: [
    QuestionnaireMorePopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(QuestionnaireMorePopoverPage),
  ],
})
export class MorePopoverPageModule {}
