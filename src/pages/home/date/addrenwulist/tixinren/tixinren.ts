import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TixinrenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tixinren',
  templateUrl: 'tixinren.html',
})
export class TixinrenPage {

  callback: any;
  remind:number;
  relationship:number;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.callback = this.navParams.get("callback");
    this.remind = this.navParams.get('remind');
  }

  toSelect() {
    this.callback(this.relationship).then(()=>{
      this.navCtrl.pop();
    });
  }

}
