import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyInfoPage } from './my-info';
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    MyInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(MyInfoPage),
    PipesModule
  ],
})
export class MyInfoPageModule {}
