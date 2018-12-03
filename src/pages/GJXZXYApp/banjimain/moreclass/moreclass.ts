import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AddbijiPage} from "../addbiji/addbiji";
import {BanjijiaoliuPage} from "../banjijiaoliu/banjijiaoliu";

/**
 * Generated class for the MoreclassPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-moreclass',
  templateUrl: 'moreclass.html',
})
export class MoreclassPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MoreclassPage');
  }

  classnoteClick(){
    this.navCtrl.push('ErlandfriendPage');
  }

}
