import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignatureBoardPage } from './signature-board';
import { SignaturePadModule } from 'angular2-signaturepad';
@NgModule({
  declarations: [
    SignatureBoardPage,
  ],
  imports: [
    SignaturePadModule,
    IonicPageModule.forChild(SignatureBoardPage),
  ],
})
export class SignatureBoardPageModule {}
