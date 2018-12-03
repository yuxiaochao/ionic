import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatSettingsPage } from './chat-settings';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    ChatSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatSettingsPage),
    PipesModule
  ],
})
export class ChatSettingsPageModule {}
