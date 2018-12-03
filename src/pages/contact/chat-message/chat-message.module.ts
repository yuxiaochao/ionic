import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatMessagePage } from './chat-message';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    ChatMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(ChatMessagePage),
    PipesModule
  ],
})
export class ChatMessagePageModule {}
