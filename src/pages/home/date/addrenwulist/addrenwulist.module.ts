import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddrenwulistPage } from './addrenwulist';
import {PipesModule} from "../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    AddrenwulistPage,
  ],
  imports: [
    IonicPageModule.forChild(AddrenwulistPage),
    PipesModule
  ],
})
export class AddrenwulistPageModule {}
