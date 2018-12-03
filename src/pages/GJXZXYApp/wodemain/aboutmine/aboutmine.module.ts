import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutminePage } from './aboutmine';

@NgModule({
  declarations: [
    AboutminePage,
  ],
  imports: [
    IonicPageModule.forChild(AboutminePage),
  ],
})
export class AboutminePageModule {}
