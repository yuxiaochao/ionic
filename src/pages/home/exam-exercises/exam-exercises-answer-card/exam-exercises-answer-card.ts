import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {Utils} from "../../../../providers/Utils";

@IonicPage()
@Component({
  selector: 'page-exam-exercises-answer-card',
  templateUrl: 'exam-exercises-answer-card.html',
})
export class ExamExercisesAnswerCardPage {
  tx : Array<string> = []; //试题题型
  topic : Array<string> = []; //试题列表
  answerCard = {};//答题结果
  answer_key:string;//存储答题结果缓存Key
  moonClass:boolean;//用于夜间模式的标识
  isAnswer:boolean = false;//标识答题是否全部已答
  paper ={}; //试卷信息
  time:string="00:00"; //展示时间字符串
  topicid:string; //试题id
  result:any; //缓存存储结果
  @ViewChild('answerHeader', { read: ElementRef }) answerHeader:ElementRef;
  @ViewChild('answerCardContent', { read: ElementRef }) answerCardContent:ElementRef;
  @ViewChild('ionFooterEl', { read: ElementRef }) ionFooterEl:ElementRef;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage:Storage,
              public viewCtrl: ViewController,
              public alertCtrl:AlertController) {
  }

  ionViewDidLoad() {
    this.initParams();
    this.initAnswerCard();
    //this.initSetting();
  }

  initParams(){
    this.tx = this.navParams.data.tx;
    this.topic = this.navParams.data.topic;
    this.answer_key = this.navParams.data.answer_key;
    this.paper = this.navParams.data.paper;
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

  initSetting(){
    this.storage.get('test_seeting').then(data=>{
      if(data && data.nightModel){
        this.moonClass = true;
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

  selectedTopic(index){
    this.viewCtrl.dismiss({currPage:index})
  }

  submitExam(){
    this.checkCompleteAnswer();
  }

  checkCompleteAnswer(){
    this.storage.get(this.answer_key).then(data=>{
      if(data){
        this.isAnswer = true;
        let answer = "";
        for(let i=0;i<this.topic.length;i++){
          answer = data['topicId_'+this.topic[i]['ID']];
          if(Utils.isEmpty(answer)){
            this.isAnswer = false;
            break;
          }
        }
      }
      this.examPrompt();
    });
  }




  examPrompt(){
    if(this.isAnswer){
      this.viewCtrl.dismiss({submit:true});
    }else{
      let alert = this.alertCtrl.create({
        message: '你还有题目未做完,<br/>确定交卷吗？',
        buttons: [
          {
            text: '继续答题',
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: '交卷',
            handler: () => {
              this.viewCtrl.dismiss({submit:true});
            }
          }
        ]
      });
      alert.present();
    }
  }
}
