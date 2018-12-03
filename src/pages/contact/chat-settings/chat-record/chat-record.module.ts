import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatRecordPage } from './chat-record';
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    ChatRecordPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatRecordPage),
    PipesModule
  ],
})
export class ChatMessagePageModule {}
