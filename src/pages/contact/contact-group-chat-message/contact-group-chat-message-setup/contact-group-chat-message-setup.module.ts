import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactGroupChatMessageSetupPage } from './contact-group-chat-message-setup';
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    ContactGroupChatMessageSetupPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactGroupChatMessageSetupPage),
    PipesModule
  ],
})
export class ContactGroupChatMessageSetupPageModule {}
