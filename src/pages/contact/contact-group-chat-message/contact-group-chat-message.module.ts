import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactGroupChatMessagePage } from './contact-group-chat-message';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    ContactGroupChatMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(ContactGroupChatMessagePage),
    PipesModule
  ],
})
export class ContactGroupChatMessagePageModule {}
