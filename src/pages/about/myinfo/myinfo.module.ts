import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyinfoPage } from './myinfo';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    MyinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(MyinfoPage),
    PipesModule
  ],
})
export class MyinfoPageModule {}
