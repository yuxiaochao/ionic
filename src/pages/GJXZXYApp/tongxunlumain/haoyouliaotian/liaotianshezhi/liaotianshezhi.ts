import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GerenziliaoPage} from "./gerenziliao/gerenziliao";

/**
 * Generated class for the LiaotianshezhiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-liaotianshezhi',
  templateUrl: 'liaotianshezhi.html',
})
export class LiaotianshezhiPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LiaotianshezhiPage');
  }

  gerenziliaoClick(){
    this.navCtrl.push('GerenziliaoPage');
  }

}
