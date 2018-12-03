import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TongxunlumainPage } from './tongxunlumain';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    TongxunlumainPage,
  ],
  imports: [
    IonicPageModule.forChild(TongxunlumainPage),
    PipesModule
  ],
})
export class TongxunlumainPageModule {}
