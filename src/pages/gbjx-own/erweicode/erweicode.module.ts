import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ErweicodePage } from './erweicode';
import {QRCodeModule} from "angular2-qrcode";
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    ErweicodePage,
  ],
  imports: [
    IonicPageModule.forChild(ErweicodePage),
    QRCodeModule,
    PipesModule
  ],
})
export class ErweicodePageModule {}
