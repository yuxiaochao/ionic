import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClassCheckinPage } from './class-checkin';
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    ClassCheckinPage,
  ],
  imports: [
    IonicPageModule.forChild(ClassCheckinPage),
    PipesModule
  ],
})
export class ClassCheckinPageModule {}
