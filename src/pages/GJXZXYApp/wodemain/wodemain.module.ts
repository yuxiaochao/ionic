import {NgModule, Pipe} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WodemainPage } from './wodemain';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    WodemainPage,
  ],
  imports: [
    IonicPageModule.forChild(WodemainPage),
    PipesModule
  ],
})
export class WodemainPageModule {}
