import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MycardPage } from './mycard';
import {PipesModule} from "../../../../pipes/pipes.module";
import {QRCodeModule} from "angular2-qrcode";

@NgModule({
  declarations: [
    MycardPage,
  ],
  imports: [
    IonicPageModule.forChild(MycardPage),
    PipesModule,
    QRCodeModule,
  ],
})
export class MycardPageModule {}
