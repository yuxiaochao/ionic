import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TwocodePage } from './twocode';
import {PipesModule} from "../../../pipes/pipes.module";
import { QRCodeModule } from 'angular2-qrcode';


@NgModule({
  declarations: [
    TwocodePage,
  ],
  imports: [
    IonicPageModule.forChild(TwocodePage),
    PipesModule,
    QRCodeModule,

  ],
})
export class TwocodePageModule {}
