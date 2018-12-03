import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HaoyouliaotianPage } from './haoyouliaotian';
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    HaoyouliaotianPage,
  ],
  imports: [
    IonicPageModule.forChild(HaoyouliaotianPage),
    PipesModule
  ],
})
export class HaoyouliaotianPageModule {}
