import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {JiechuhaoyouPage} from "./jiechuhaoyou/jiechuhaoyou";

/**
 * Generated class for the GerenziliaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gerenziliao',
  templateUrl: 'gerenziliao.html',
})
export class GerenziliaoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GerenziliaoPage');
  }

  jiechuhaoyou(){
    this.navCtrl.push('JiechuhaoyouPage');
  }
}
