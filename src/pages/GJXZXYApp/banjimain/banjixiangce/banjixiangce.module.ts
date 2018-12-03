import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BanjixiangcePage } from './banjixiangce';
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    BanjixiangcePage,
  ],
  imports: [
    IonicPageModule.forChild(BanjixiangcePage),
    PipesModule
  ],
})
export class BanjixiangcePageModule {}
