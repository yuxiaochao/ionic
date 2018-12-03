import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ErrorTopicListPage } from './error-topic-list';
import {ErrorTopicService} from "../../../../service/error-topic/ErrorTopicService";

@NgModule({
  declarations: [
    ErrorTopicListPage,
  ],
  imports: [
    IonicPageModule.forChild(ErrorTopicListPage),
  ],
  providers:[
    ErrorTopicService
  ]
})
export class ErrorTopicListPageModule {}
