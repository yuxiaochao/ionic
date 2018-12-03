import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CommonService} from "../../../service/CommonService";
import {GlobalData} from "../../../providers/GlobalData";

/**
 * Generated class for the SurveyRecordsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-survey-records',
  templateUrl: 'survey-records.html',
})
export class SurveyRecordsPage {

  items : any = [];
  start : number = 1;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService : CommonService,
             public globalData: GlobalData) {
  }

  ionViewDidLoad() {
     //初始化界面
     this.initDate();

  }
  initDate(){
     this.initInfo().subscribe(data=>{
       if(data.researchHistory &&data.researchHistory.length>=1){
          this.items=data.researchHistory;
          }
     })

  }

  initInfo(paramMap?){

      return this.commonService.getPage('/mine/researchHistory',paramMap);

  }

  //加载
  doInfinite(infiniteScroll){
    this.globalData.showLoading = false;
    this.initInfo({START:++this.start})
      .auditTime(500)
      .subscribe(data=>{
        if(data.researchHistory.length > 0){
          this.items = this.items.concat(data.researchHistory);
        }else{
          infiniteScroll.enable(false);
        }
        infiniteScroll.complete();

      })
    this.globalData.showLoading = true;



  }
}
