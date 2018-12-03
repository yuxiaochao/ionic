import {Component, Input} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Topic} from "../../../../model/Topic";
import {Utils} from "../../../../providers/Utils";

@Component({
  selector: 'page-online-exam-topic-answer-result',
  templateUrl: 'online-exam-topic-answer-result.html',
})
export class OnlineExamTopicAnswerResultPage {
  @Input()slides:any;
  @Input()topic: Topic; //试题对象
  @Input()paper:Object;
  @Input()pageination:any;
  @Input()answerList:Array<string>;
  multi_index = {}; //多选当前选中答题选项下标
  multi_answer_index = {};
  multi_answer = {};//单选答题结果
  answer:string = "此题未做";//用户答案
  topic_answer:string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngAfterContentInit(){
    //this.multi_answer['multi_'+(Utils.getNumber(this.topic.TOPICKEY)-1)] ="right";
    this.answerList.forEach((val,i)=>{
        if(val['TOPICID'] == this.topic.ID){
          if(this.topic.BASETYPE === 0){
            let answers = this.answer.split("$$");
            let dou = "";
            let answerResult = "";
            if(answers.length > 0){
              for(let j=0;j<answers.length;j++){
                answerResult +=dou + (answers[j] == ''?'--':answers[j]);
                dou = "<br/>";
              }
            }else{
              answerResult = this.answer;
            }
            this.answer = answerResult;

            answers = this.topic.TTOP021.split("$$")
            if(answers.length > 0){
              for(let j=0;j<answers.length;j++){
                answerResult +=dou + (answers[j] == ''?'--':answers[j]);
                dou = "<br/>";
              }
              this.topic_answer = answerResult;
            }
          }else{
            this.answer = val['EXTANSWER'].toUpperCase();
          }
          /*if(this.topic.BASETYPE === 1 || this.topic.BASETYPE === 3){
            this.initBaseType1();
          }else if(this.topic.BASETYPE === 2 || this.topic.BASETYPE === 7){
            this.initBaseType2();
          }*/
        }
    })
  }

  //单选、判断题
  initBaseType1(){
    if(this.answer != this.topic.TOPICKEY){
      this.multi_answer['multi_'+(Utils.getNumber(this.answer)-1)] ="err";
    }
  }

  initBaseType2(){

  }

}
