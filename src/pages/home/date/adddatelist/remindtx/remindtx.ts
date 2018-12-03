import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-remindtx',
  templateUrl: 'remindtx.html',
})
export class RemindtxPage {

  callback:any;
  relationship:number;
  remind:number;
  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
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
