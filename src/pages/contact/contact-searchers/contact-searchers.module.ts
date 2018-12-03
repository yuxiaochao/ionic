import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactSearchersPage } from './contact-searchers';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    ContactSearchersPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactSearchersPage),
    PipesModule
  ],
})
export class ContactSearchersPageModule {}
