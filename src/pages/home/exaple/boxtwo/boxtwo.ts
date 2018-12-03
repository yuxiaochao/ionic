import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BoxtwoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-boxtwo',
  templateUrl: 'boxtwo.html',
})
export class BoxtwoPage {

  // num = 2;
  // nug :string='-webkit-box';
  // nuh :string='hidden';
  constructor(
              public navCtrl: NavController,
              public navParams: NavParams)
  {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BoxtwoPage');
  }

  // run(){
  //   this.num==2 ? this.num=6 : this.num=2;
  //   this.nug=='-webkit-box' ?  this.nug='block' : this.nug='-webkit-box';
  //   this.nuh=='hidden' ? this.nuh='inherit' :  this.nuh='hidden';
  // }
}
