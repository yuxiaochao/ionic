import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CommonService} from "../../../service/CommonService";
import {GlobalData} from "../../../providers/GlobalData";


/**
 * Generated class for the StudynotesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-studynotes',
  templateUrl: 'studynotes.html',
})
export class StudynotesPage {

  items : any = [];
  start :number = 1;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService : CommonService,
              public globalData: GlobalData
              ) {
  }

  ionViewDidLoad() {
    this.initDate();
  }
  initDate(){
     this.initInfo().subscribe( data=>{
       if(data.studyHistory && data.studyHistory.length>=1){
            this.items=data.studyHistory;
         }
     });

  }
  initInfo(paramMap?){
    return this.commonService.getPage('/mine/studyHistory',paramMap);

  }

  //加载更多数据
  doInfinite(infiniteScroll){
    this.globalData.showLoading= false;
    this.initInfo({START:++this.start}).auditTime(500).subscribe(data=>{
       if(data.studyHistory && data.studyHistory.length>=1){
         this.items=this.items.concat(data.studyHistory);
         }else{
         infiniteScroll.enable(false);
         }
      infiniteScroll.complete();
      })
    this.globalData.showLoading= true;



  }

}
