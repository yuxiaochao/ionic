import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotedetailsPage } from './notedetails';
import {PipesModule} from "../../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    NotedetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(NotedetailsPage),
    PipesModule
  ],
})
export class NotedetailsPageModule {}
