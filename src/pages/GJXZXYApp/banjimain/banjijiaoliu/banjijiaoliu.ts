import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {InterflowdetailPage} from "./interflowdetail/interflowdetail";

/**
 * Generated class for the BanjijiaoliuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-banjijiaoliu',
  templateUrl: 'banjijiaoliu.html',
})
export class BanjijiaoliuPage {

  wenjian:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BanjijiaoliuPage');
  }


  addwenjian(){
    if(!this.wenjian){
      this.wenjian=true;
    }else{
      this.wenjian=false;
    }
  }

  interflowdetail(){
    this.navCtrl.push('InterflowdetailPage');
  }
}
