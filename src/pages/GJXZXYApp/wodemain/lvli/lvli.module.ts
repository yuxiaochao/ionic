import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LvliPage } from './lvli';
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    LvliPage,
  ],
  imports: [
    IonicPageModule.forChild(LvliPage),
    PipesModule
  ],
})
export class LvliPageModule {}
