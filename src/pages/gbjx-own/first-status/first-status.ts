import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CommonService} from "../../../service/CommonService";

/**
 * Generated class for the FirstStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-first-status',
  templateUrl: 'first-status.html',
})
export class FirstStatusPage {

  current: number = 0;
  duigou:  number=0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService:CommonService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatusPage');
    this.current=this.navParams.get("ITEM");
    this.duigou=this.navParams.get("ITEM");
  }

  //点击所有选择下的选项
  resetnumber(num){
    this.current=num;
    this.duigou=num;
  }

  //保存
  preservation(){
    this.commonService.getPage('/huarui/hrswTUserstatus/insterUserStatus',{
      USST003:this.current,
      USST004:1,
      USST008:0
    }).auditTime(500).subscribe(data=>{
      if(data.flage){
        this.navCtrl.pop();
      }
    })

  }
}
