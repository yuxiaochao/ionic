import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WkmtdetailPage } from './wkmtdetail';
import {PipesModule} from "../../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    WkmtdetailPage,
  ],
  imports: [
    IonicPageModule.forChild(WkmtdetailPage),
    PipesModule
  ],
})
export class WkmtdetailPageModule {}
