import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {Observable} from "rxjs/Rx";
import {Utils} from "../../../../providers/Utils";

/**
 * Generated class for the StandardsTrainAnswerCardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-standards-train-answer-card',
  templateUrl: 'standards-train-answer-card.html',
})
export class StandardsTrainAnswerCardPage {

  tx : Array<string> = []; //试题题型
  topic : Array<string> = []; //试题列表
  answerCard = {};//答题结果
  answer_key:string;//存储答题结果缓存Key
  time:string="00:00"; //展示时间字符串
  testtime : number = 0; //已答时间
  topicid:string; //试题id
  result:any; //缓存存储结果
  timeObser:any;
  constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public storage:Storage,
                public viewCtrl: ViewController) {
          this.initParams();
  }

  ionViewDidLoad() {
    this.initAnswerCard();
  }

  initParams(){
    if (this.navParams.data) {
      this.tx = this.navParams.data.tx;
      this.topic = this.navParams.data.topic;
      this.answer_key = this.navParams.data.answer_key;
      this.testtime = this.navParams.data.testtime;
    }
  }

  calculateTime(){
    this.time = Utils.formatSeconds({value:this.testtime++,formatsp:true,showMinute:true});
  }

  startTime(){
    this.calculateTime();
    this.timeObser =Observable.interval(1000).subscribe(data=>{
      this.calculateTime();
    });
  }

  ionViewCanEnter(){
    this.startTime();
  }

  ionViewCanLeave(){
    if(this.timeObser){
      this.timeObser.unsubscribe();
    }
  }


  initAnswerCard(){
    this.storage.get(this.answer_key).then(data=>{
      if(data){
        for(var str in data){
          if(str.indexOf('answer_result_') != -1){
            this.topicid = str.split('_')[2];
            this.result = data[str];
            this.initSelectedAnswerCard();
          }
        }
      }
    });
  }

  //初始化已答试题
  initSelectedAnswerCard(){
    if (this.result == 'right'){
      this.answerCard['answer_' + this.topicid] = 'right';
    }else if(this.result == 'error'){
      this.answerCard['answer_' + this.topicid] = 'error';
    }
  }

  closeAnswerCard(){
    this.viewCtrl.dismiss();
  }


}
