import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GaodeMapTestPage } from './gaode-map-test';

@NgModule({
  declarations: [
    GaodeMapTestPage,
  ],
  imports: [
    IonicPageModule.forChild(GaodeMapTestPage),
  ],
})
export class GaodeMapTestPageModule {}
