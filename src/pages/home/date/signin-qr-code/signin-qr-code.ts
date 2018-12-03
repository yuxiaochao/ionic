import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Utils} from "../../../../providers/Utils";
import {CommonService} from "../../../../service/CommonService";
import {NativeService} from "../../../../providers/NativeService";


@IonicPage()
@Component({
  selector: 'page-signin-qr-code',
  templateUrl: 'signin-qr-code.html',
})
export class SigninQrCodePage {

  meet001: string;
  qrValue: any = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService,
              public nativeService: NativeService,) {

  }

  ionViewDidLoad() {
    this.meet001 = this.navParams.get('MEET001');
    let qrValue1 = {type: 0, value: this.meet001};
    this.qrValue = JSON.stringify(qrValue1);
  }

}
