import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GlobalData} from "../../../providers/GlobalData";
import { Md5 } from 'ts-md5/dist/md5';
/**
 * Generated class for the ErweicodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-erweicode',
  templateUrl: 'erweicode.html',
})
export class ErweicodePage {

  USER001='';
  userInfo={};
  qrValue:string;
  constructor(public navCtrl: NavController,
                public navParams: NavParams,
               public globData:GlobalData) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ErweicodePage');

    this.userInfo=this.navParams.get("TIME");
    this.USER001=this.globData.userId;
    //this.USER001=Md5.hashStr(this.USER001).toString();
    let qrValue1 = {type: 1, value: this.USER001};
    this.qrValue = JSON.stringify(qrValue1);
  }

}
