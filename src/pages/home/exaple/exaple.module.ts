import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExaplePage } from './exaple';

@NgModule({
  declarations: [
    ExaplePage,
  ],
  imports: [
    IonicPageModule.forChild(ExaplePage),
  ],
})
export class ExaplePageModule {}
