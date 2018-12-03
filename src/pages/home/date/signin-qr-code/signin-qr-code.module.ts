import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SigninQrCodePage } from './signin-qr-code';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  declarations: [
    SigninQrCodePage,
  ],
  imports: [
    IonicPageModule.forChild(SigninQrCodePage),
    QRCodeModule
  ],
})
export class SigninQrCodePageModule {}
