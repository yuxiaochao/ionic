import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CommonService} from "../../../service/CommonService";

/**
 * Generated class for the PersonalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-personal',
  templateUrl: 'personal.html',
})
export class PersonalPage {

  userInfo={};
  constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public  commonService:CommonService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonalPage');
   this.initDate();

  }

    ionViewDidEnter() {
    console.log('ionViewDidLoad PersonalPage');
    this.initDate();

  }

  statusClick(){

    this.navCtrl.push('StatusPage',{TIME:this.userInfo["USST003"]}) //跳转工作状态

  }
  initDate(){
    this.commonService.getPage('/mine/MyuserInfo').subscribe(data=>{
      if(data){
        let item=data.userInfo;
        this.userInfo=item[0]
      }
    })
  }
}
