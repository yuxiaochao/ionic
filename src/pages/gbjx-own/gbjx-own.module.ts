import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GbjxOwnPage } from './gbjx-own';
import {PipesModule} from "../../pipes/pipes.module";


@NgModule({
  declarations: [
    GbjxOwnPage,
  ],
  imports: [
    IonicPageModule.forChild(GbjxOwnPage),
    PipesModule
  ],
})
export class GbjxOwnPageModule {}
