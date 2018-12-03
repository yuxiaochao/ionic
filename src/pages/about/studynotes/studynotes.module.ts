import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudynotesPage } from './studynotes';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    StudynotesPage,
  ],
  imports: [
    IonicPageModule.forChild(StudynotesPage),
    PipesModule
  ],
})
export class StudynotesPageModule {}
