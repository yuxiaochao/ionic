import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TongzhigonggaoPage } from './tongzhigonggao';
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    TongzhigonggaoPage,
  ],
  imports: [
    IonicPageModule.forChild(TongzhigonggaoPage),
    PipesModule
  ],
})
export class TongzhigonggaoPageModule {}
