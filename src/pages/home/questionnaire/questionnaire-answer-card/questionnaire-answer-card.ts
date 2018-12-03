import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavParams, ViewController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {Utils} from "../../../../providers/Utils";
import {Observable} from "rxjs/Rx";
import {NativeService} from "../../../../providers/NativeService";

@IonicPage()
@Component({
  selector: 'page-questionnaire-answer-card',
  templateUrl: 'questionnaire-answer-card.html',
})
export class QuestionnaireAnswerCardPage {

  tx : Array<string> = []; //试题题型
  topic : Array<string> = []; //试题列表
  answerCard = {};//答题结果
  answer_key:string;//存储答题结果缓存Key
  moonClass:boolean;//用于夜间模式的标识
  isAnswer:boolean = false;//标识答题是否全部已答
  paper ={}; //试卷信息
  time:string="00:00"; //展示时间字符串
  remainingTime:number = 0; //倒计时时间
  testtime : number = 0; //已答时间
  timeObser:any;
  uncert:Object = {}; //存储不定项集合
  topicid:string; //试题id
  result:any; //缓存存储结果

  @ViewChild('answerHeader', { read: ElementRef }) answerHeader:ElementRef;
  @ViewChild('answerCardContent', { read: ElementRef }) answerCardContent:ElementRef;
  @ViewChild('ionFooterEl', { read: ElementRef }) ionFooterEl:ElementRef;
  constructor(public viewCtrl: ViewController,
              public storage:Storage,
              public navParams: NavParams,
              public alertCtrl:AlertController,
              public nativeService:NativeService) {
      this.initParams();
  }

  ionViewDidLoad() {

    this.storage.get(this.answer_key).then(data=>{
      this.initAnswerCard(data);
    });

    this.storage.get('test_seeting').then(data=>{
      if(data && data.nightModel){
        this.moonClass = true;
      }
    });

  }

  initParams(){
    if (this.navParams.data) {
      this.tx = this.navParams.data.tx;
      this.topic = this.navParams.data.topic;
      this.answer_key = this.navParams.data.answer_key;
      this.paper = this.navParams.data.paper;
      this.testtime = this.navParams.data.testtime;
    }
  }



  ionViewCanEnter(){
    this.initTime();
  }

  initTime(){
    this.startTime();
  }

  startTime(){
    this.calculateTime();
    this.timeObser =Observable.interval(1000).subscribe(data=>{
      this.calculateTime();
    });
  }

  calculateTime(){
    this.testtime++
    this.remainingTime = this.testtime;
    this.time = Utils.formatSeconds({value:this.remainingTime,formatsp:true,showMinute:true});
  }


  ionViewCanLeave(){
    if(this.timeObser){
      this.timeObser.unsubscribe();
    }
  }

//初始化缓存数据
  initAnswerCard(data){
    if(data){
      for(let str in data){
        this.topicid = str.split('_')[1];
        this.result = data[str];
        if(str.indexOf('topicId_') != -1)
          this.initSelectedAnswerCard();
        else if(str.indexOf('uncert_') != -1)
          this.initUncert();

      }
    }
  }

  //初始化已答试题
  initSelectedAnswerCard(){
    if (Utils.isNotEmpty(this.result)){
      this.answerCard['answer_' + this.topicid] = this.topicid;
    }
  }
  //初始化不确定项
  initUncert(){
    if (this.result){
      this.uncert['show_'+this.topicid] = true;
    }
  }


  closeAnswerCard(){
    this.viewCtrl.dismiss();
  }

  selectedTopic(index){
    this.viewCtrl.dismiss({currPage:index});
  }

  checkCompleteAnswer(){
    this.storage.get(this.answer_key).then(data=>{
      if(data){
        this.isAnswer = true;
        let answer = "";
        for(let i=0;i<this.topic.length;i++){
          answer = data['topicId_'+this.topic[i]['QTID']];
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
      let alert = this.alertCtrl.create({
        message: '确定提交调查问卷吗？',
        buttons: [
          {
            text: '取消',
            handler: () => {
            }
          },
          {
            text: '确定',
            handler: () => {
              this.viewCtrl.dismiss({submit:true});
            }
          }
        ]
      });
      alert.present();

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

  submitExam(){
    this.checkCompleteAnswer();
  }

}
