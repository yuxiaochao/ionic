import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholeGroupPage } from './whole-group';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    WholeGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(WholeGroupPage),
    PipesModule
  ],
})
export class WholeGroupPageModule {}
