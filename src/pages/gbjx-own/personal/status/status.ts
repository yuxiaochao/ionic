import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";

/**
 * Generated class for the StatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-status',
  templateUrl: 'status.html',
})
export class StatusPage {

  current: number = 0;
  duigou:  number=0;

  constructor(public navCtrl: NavController,
                public navParams: NavParams,
               public commonService:CommonService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatusPage');

    this.current=this.navParams.get("TIME");
    this.duigou=this.navParams.get("TIME");
  }



  resetnumber(num){    //点击所有选择下的选项
    this.current=num;
    this.duigou=num;  //duigou
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
