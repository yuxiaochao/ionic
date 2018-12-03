import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactGroupSearchersPage } from './contact-group-searchers';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    ContactGroupSearchersPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactGroupSearchersPage),
    PipesModule
  ],
})
export class ContactGroupSearchersPageModule {}
