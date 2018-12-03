import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkHomePage } from './work-home';

@NgModule({
  declarations: [
    WorkHomePage,
  ],
  imports: [
    IonicPageModule.forChild(WorkHomePage),
  ],
})
export class WorkHomePageModule {}
