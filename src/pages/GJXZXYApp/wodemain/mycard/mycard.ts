import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GlobalData} from "../../../../providers/GlobalData";

/**
 * Generated class for the MycardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mycard',
  templateUrl: 'mycard.html',
})
export class MycardPage {

  userInfo:any=[];
  qrValue:string;//二维码数据
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public globalData: GlobalData,) {
  }

  ionViewDidLoad() {
    this.userInfo = this.navParams.get('userInfo');
    let qrValue1 = {type: 1, value: this.globalData.userId};
    this.qrValue = JSON.stringify(qrValue1);
  }

}
