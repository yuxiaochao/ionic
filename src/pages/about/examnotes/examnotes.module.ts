import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExamnotesPage } from './examnotes';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    ExamnotesPage,
  ],
  imports: [
    IonicPageModule.forChild(ExamnotesPage),
    PipesModule
  ],
})
export class ExamnotesPageModule {}
