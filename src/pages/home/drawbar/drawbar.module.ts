import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DrawbarPage } from './drawbar';

@NgModule({
  declarations: [
    DrawbarPage,
  ],
  imports: [
    IonicPageModule.forChild(DrawbarPage),
  ],
})
export class DrawbarPageModule {}
