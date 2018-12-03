import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RepetitioncfPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-repetitioncf',
  templateUrl: 'repetitioncf.html',
})
export class RepetitioncfPage {

  callback:any;
  relationship:number;
  repeat:number;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.callback = this.navParams.get("callback");
    this.repeat = this.navParams.get('repeat');
  }

  toSelect() {
    this.callback(this.relationship).then(()=>{
      this.navCtrl.pop();
    });
  }

}
