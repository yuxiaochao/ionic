import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddhuiyilistPage } from './addhuiyilist';
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    AddhuiyilistPage,
  ],
  imports: [
    IonicPageModule.forChild(AddhuiyilistPage),
    PipesModule
  ],
})
export class AddhuiyilistPageModule {}
