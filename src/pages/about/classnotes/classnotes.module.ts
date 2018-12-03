import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClassnotesPage } from './classnotes';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    ClassnotesPage,
  ],
  imports: [
    IonicPageModule.forChild(ClassnotesPage),
    PipesModule
  ],
})
export class ClassnotesPageModule {}
