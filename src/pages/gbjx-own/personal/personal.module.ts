import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalPage } from './personal';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    PersonalPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonalPage),
    PipesModule
  ],
})
export class PersonalPageModule {}
