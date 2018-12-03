import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BoxfivePage } from './boxfive';
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    BoxfivePage,
  ],
  imports: [
    IonicPageModule.forChild(BoxfivePage),
    PipesModule
  ],
})
export class BoxfivePageModule {}
