import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CommonService} from "../../../../../../service/CommonService";
import {GlobalData} from "../../../../../../providers/GlobalData";

/**
 * Generated class for the AboutpublicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-aboutpublic',
  templateUrl: 'aboutpublic.html',
})
export class AboutpublicPage {

  items : any={};
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService,
              public globaData:GlobalData) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutpublicPage');
    this.items=this.navParams.get("ITEM");
    this.initDate(this.items);
  }

  initDate(item){

    this.commonService.getPage('/cts/groups/queryNoticeDetils',{
      USER001:this.globaData.userId,
      NOT001:item.NOT001,
    }).subscribe(data=>{
      if(data.noticeInfo){
        this.items=data.noticeInfo;
      }

    })

  }

}
