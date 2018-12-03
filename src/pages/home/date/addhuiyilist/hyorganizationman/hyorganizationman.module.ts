import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HyorganizationmanPage } from './hyorganizationman';
import {PipesModule} from "../../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    HyorganizationmanPage,
  ],
  imports: [
    IonicPageModule.forChild(HyorganizationmanPage),
    PipesModule
  ],
})
export class HyorganizationmanPageModule {}
