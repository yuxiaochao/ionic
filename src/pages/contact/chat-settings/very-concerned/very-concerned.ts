import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";


@IonicPage()
@Component({
  selector: 'page-very-concerned',
  templateUrl: 'very-concerned.html',
})
export class VeryConcernedPage {

  mushrooms: any = {isCheck: false};
  otherParty: string;
  queryVeryConcerned: any = [];
  initialType: boolean;//进入页面时特别关心类型

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService,) {
  }

  ionViewDidLoad() {
    this.otherParty = this.navParams.get("thisUSERID");
    this.commonService.getPage('/cts/queryVeryConcerned', {otherUserid: this.otherParty}).subscribe(data => {
      if (data.queryVeryConcerned&&data.queryVeryConcerned[0]) {
        this.queryVeryConcerned = data.queryVeryConcerned[0];
        this.mushrooms.isCheck = this.queryVeryConcerned['frrs006'] == '1';
        this.initialType = this.queryVeryConcerned['frrs006'] == '1';
      } else {
        this.mushrooms.isCheck = false;
        this.initialType = false;
      }
    });
  }

  ionViewWillLeave() {//离开页面事件
    if (this.initialType != this.mushrooms.isCheck) {
      let frrs006 = '';
      if (this.mushrooms.isCheck) {
        frrs006 = '1'
      } else {
        frrs006 = '0'
      }
      this.commonService.getPage('/cts/setVeryConcerned',
        {otherParty: this.otherParty, frrs006: frrs006}).subscribe(data => {
      });
    }
  }

}
