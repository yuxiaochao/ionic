import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {OnlineExamService} from "../../../../service/online-exam/OnlineExamService";

@IonicPage({
  segment: 'examDetail/:tact001'
})
@Component({
  selector: 'page-online-exam-detail',
  templateUrl: 'online-exam-detail.html',
})
export class OnlineExamDetailPage {

  item={};
  title:string; //头部标题
  tact005:number = 1; //试卷类型
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public onlineExamService : OnlineExamService) {
  }

  ionViewDidLoad() {
    let tact001 = this.navParams.get("tact001")
    this.tact005 = this.navParams.get("tact005");
    if(this.tact005 === 9)
      this.title = '模拟考试';
    else
      this.title = '在线考试'
    this.onlineExamService.examDetail(tact001).subscribe(data=>{
      this.item = data.examPaper;
    })
  }

  startExam(item:any){
      this.navCtrl.push('OnlineExamTestPage',{
        tact001:item.TACT001,
        tact005:this.tact005
      })
  }


}
