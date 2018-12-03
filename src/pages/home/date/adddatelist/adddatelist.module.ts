import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdddatelistPage } from './adddatelist';
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    AdddatelistPage,
  ],
  imports: [
    IonicPageModule.forChild(AdddatelistPage),
    PipesModule
    
  ],
})
export class AdddatelistPageModule {}
