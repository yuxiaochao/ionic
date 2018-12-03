import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MygroupclassPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mygroupclass',
  templateUrl: 'mygroupclass.html',
})
export class MygroupclassPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MygroupclassPage');
  }

  classnotefunc(){
    this.navCtrl.push('BanjijiaoliuPage');
  }

}
