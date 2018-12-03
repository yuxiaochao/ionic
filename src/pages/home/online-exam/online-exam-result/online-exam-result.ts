import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {OnlineExamService} from "../../../../service/online-exam/OnlineExamService";

@IonicPage()
@Component({
  selector: 'page-online-exam-result',
  templateUrl: 'online-exam-result.html',
})
export class OnlineExamResultPage {

  result:any = {};
  isQueryExamAnswer:boolean = true;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public onlineExamService:OnlineExamService) {
  }

  ionViewDidLoad() {
    let egid = this.navParams.get("egid")
    this.onlineExamService.findExamResult(egid).subscribe(data=>{
      this.result = data.eg;
      if(this.result.TACT017 === 1){
        this.isQueryExamAnswer = false;
      }
    })
  }

  again(){
    this.navCtrl.pop();
  }

  findExamAnswer(){
    if(this.result.TACT017 === 1){
      return;
    }

    this.navCtrl.push("OnlineExamAnswerResultPage",
      {TACT001:this.result.TACT001,
              EGRA001:this.result.EGRA001
    });
  }

}
