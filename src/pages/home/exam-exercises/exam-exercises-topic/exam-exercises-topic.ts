import {Component, Input} from '@angular/core';
import {Storage} from "@ionic/storage";
import {Utils} from "../../../../providers/Utils";
import {Topic} from "../../../../model/Topic";
import {Observable} from "rxjs/Rx";
import {ExamExercisesService} from "../../../../service/exam-exercises/ExamExercisesService";
import {GlobalData} from "../../../../providers/GlobalData";
import {AlertController, NavController, NavParams, ToastController} from "ionic-angular";

@Component({
  selector: 'exam-exercises-topic',
  templateUrl: 'exam-exercises-topic.html',
})
export class ExamExercisesTopicPage {
  @Input()topic: Topic; //试题对象
  @Input()answer_key:string; //答题结果key
  @Input()topic_index:number; //当前题数
  @Input()is_answer:boolean;//滑动过程是否可答题
  @Input()slides:any;
  @Input()paper:any; //题库练习信息
  @Input()pageination:any; //试题题号对象
  @Input()way:string='answer';

  current_answer_index:number;//单选当前选中答题选项下标
  answer_object:any; //答题对象
  essay:string; //问答题答题结果
  multi_answer_index = {}; //多选题题多个答题结果选项
  topic_answer:string; //答案
  multi_index = {}; //多选当前选中答题选项下标
  current_index:number; //单选当前选中答题选项下标（背景色标识）
  items : Array<string> = []; //评论列表
  userid:string;
  disabled:boolean = false;//解决重复答题跳转试题(单选题)或解决当前试题只能答一次
  showWay:boolean; //是否显示背题信息
  answerResult:boolean; //答题是否正确
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage:Storage,
              public examExercisesService:ExamExercisesService,
              public globalData:GlobalData,
              public alertCtrl: AlertController,
              private toastCtrl: ToastController) {
  }

  ngAfterViewInit(){
    this.userid = this.globalData.userId;
    //回显已答数据
    this.storage.get(this.answer_key).then(data=>{//获取缓存数据
      this.answer_object = data || {};
      this.answer_show_cache();
    });
  }

  ngAfterContentInit(){
    this.initBackAnswer();
  }

  //背题模式答案结果展示
  initBackAnswer(){
    if(this.topic.BASETYPE === 0){
      this.topic_answer = this.topic.TTOP021K;
    }else if(this.topic.BASETYPE === 4){
      this.topic_answer = this.topic.TTOP021;
    }else{
      this.topic_answer = this.topic.TOPICKEY.toUpperCase();
    }

  }

  answer_question(ev:any,option_index,flag?:boolean){
    if(!this.is_answer || this.disabled || this.way == 'back'){
      ev.preventDefault();
      return;
    }
    if(this.topic.BASETYPE == 1 || this.topic.BASETYPE == 3){ //单选题
      this.current_index = option_index;
      //  验证答题是否正确
      this.answerResult  = Utils.letter(this.current_index+1) == this.topic.TOPICKEY.trim()?true:false;
      let subscription = Observable.timer(300).subscribe(data=>{
        this.current_index = -1;
        if(flag) this.current_answer_index = option_index;
        subscription = Observable.timer(300).subscribe(data=>{
          if(this.answerResult){//答对自动下一题
            this.slides.slideTo(this.slides.activeIndex+1);
          }
          subscription.unsubscribe();
        })
      });

    }else if(this.topic.BASETYPE == 2 || this.topic.BASETYPE == 7){
      this.multi_index['multi_'+option_index] = option_index;
      Observable.timer(300).subscribe(data=>{
        this.multi_index['multi_'+option_index] = -1;
        if(flag)
          this.multi_answer_index['multi_'+option_index] = this.multi_answer_index['multi_'+option_index]==option_index?-1:option_index;
      });
    }

    flag && this.storage.get(this.answer_key).then(data=>{//获取缓存数据
      this.answer_object = data || {};
      if(this.topic.BASETYPE == 1 || this.topic.BASETYPE == 3)
        flag&&this.dealBaseType1();
      else if(this.topic.BASETYPE == 2 || this.topic.BASETYPE == 7)
        flag&&this.dealBaseType2(option_index);
    })
  }


  //单选题、判断题数据处理
  dealBaseType1(){
    this.answer_object['topicId_'+this.topic.ID] = Utils.letter(this.current_index+1);
    this.updateRightError();
  }

  //多选题、不定项题数据处理
  dealBaseType2(option_index:number){
    let flag = this.multi_answer_index['multi_'+option_index] == option_index?true:false; //验证当前是选中还是未选中
    let answer = this.answer_object['topicId_'+this.topic.ID] || '';
    option_index++;
    if(flag){
      if(answer.indexOf(Utils.letter(option_index)) >= 0)
        answer= answer.replace(Utils.letter(option_index),"");
    }else{
      if(answer.indexOf(Utils.letter(option_index)) <= 0)
        answer=answer+Utils.letter(option_index);
    }
    this.answer_object['topicId_'+this.topic.ID] = answer;
    this.storage.set(this.answer_key,this.answer_object);
  }

  answer_show_cache(){
    let answer = this.answer_object["topicId_"+this.topic.ID];
    if(Utils.isNotEmpty(answer)){
      if(this.topic.BASETYPE === 1 || this.topic.BASETYPE === 3){
        this.current_answer_index = Utils.getNumber(answer)-1;
      }else if(this.topic.BASETYPE === 4){
        this.essay = answer;
      }else if(this.topic.BASETYPE == 2 || this.topic.BASETYPE == 7){
        answer = answer.split("");
        let thiss = this;
        answer.forEach(function(item){
          thiss.multi_answer_index['multi_'+(Utils.getNumber(item)-1)] = Utils.getNumber(item)-1;
        });
      }
    }

    //当前试题是否答错，若答错则不能进行答题
    let answerResult = this.answer_object["answer_result_"+this.topic.ID];
    if(answerResult){//当前试题已答将不允许在答题
      this.disabled = true;
      if(answerResult == 'error'){//当前试题答错显示答案信息
        this.showWay = true;
      }
    }
  }

  answer_essay($event){
    this.storage.get(this.answer_key).then(data=>{//获取缓存数据
      this.answer_object = data || {};
      this.answer_object['topicId_'+this.topic.ID] = $event.target.value;
      this.storage.set(this.answer_key,this.answer_object);
    });
  }

  //更新答题结果的正确、错误、正确率
  updateRightError(){
    this.disabled = true;
    if(this.answerResult){
      this.answer_object['answer_result_'+this.topic.ID] ='right';
      this.pageination.rightNum ++;
    }else{
      this.answer_object['answer_result_'+this.topic.ID] ='error';
      this.pageination.errorNum ++;
      this.showWay = true;
    }
    this.pageination.accuracy = this.pageination.rightNum === 0?'0':parseFloat((this.pageination.rightNum*100  /(this.pageination.rightNum+this.pageination.errorNum)).toFixed(2));
    this.storage.set(this.answer_key,this.answer_object);

    //当前试题为正确自动切换到下一题
    if(this.topic.BASETYPE === 0 || this.topic.BASETYPE === 2 || this.topic.BASETYPE === 4 || this.topic.BASETYPE === 7){
      if(this.answerResult){
        let subscription = Observable.timer(300).subscribe(data=>{
          this.slides.slideTo(this.slides.activeIndex+1);
          subscription.unsubscribe();
        })
      }
    }
  }

  //确认答案
  confirmAnswer(){
    this.storage.get(this.answer_key).then(data=>{//获取缓存数据
      //验证答题是否为空
      this.answer_object = data || {};
      let answer = this.answer_object["topicId_"+this.topic.ID];
      if(this.topic.BASETYPE === 0){
        answer = answer.replace(/[$][$]/g,'');
      }
      if(Utils.isEmpty(answer)){
        let msg = '请选择答案！';
        if(this.topic.BASETYPE === 4 || this.topic.BASETYPE === 0){
          msg = '请填写答案';
        }
        let toast = this.toastCtrl.create({
          message: msg,
          duration: 3000,
          position: 'top'
        });
        toast.present();
        return;
      }

      if(this.topic.BASETYPE === 4 || this.topic.BASETYPE === 0){
        if(this.topic.BASETYPE === 0){ //填空题答案组装成 ‘、’符号分割
          answer = this.answer_object["topicId_"+this.topic.ID];//重新获取答题结果，上面为了验证答题结果是否为空已改变
          answer = answer.replace(/[$][$]/g,'、');
        }
        this.writeResult(answer);
      }else if(this.topic.BASETYPE === 2 || this.topic.BASETYPE === 7){
        this.choiceResult(answer);
      }
    })
  }

  //多选题判断当前试题是否正确
  choiceResult(answer){
    answer = answer.split("").sort().join("");
    if(answer ==  this.topic.TOPICKEY)
      this.answerResult = true;
    else
      this.answerResult = false;
    this.updateRightError();
  }

  //填空题、问答题人为来选择当前试题是否正确
  writeResult(answer){
    let alert = this.alertCtrl.create({cssClass:'choiceRes'});
    alert.setTitle('确认答案');
    alert.setSubTitle("<i class='danger' >你的答案：</i>"+answer);
    alert.setMessage("<i ion-text class='danger' >正确答案：</i>"+this.topic_answer);
    alert.addInput({
      type: 'radio',
      label: '对',
      value: 'true',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: '错',
      value: ''
    });

    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        this.answerResult = data;
        this.updateRightError();
      }
    });
    alert.present();
  }

  //评论
  meComment(emes002,emes001){
    let prompt = this.alertCtrl.create({
      title: '评论',
      inputs: [
        {
          name: 'emes004',
          placeholder: '请发表您的评论'
        },
      ],
      buttons: [
        {
          text: '取消',
          handler: data => {

          }
        },
        {
          text: '确定',
          handler: data => {
            if(data.emes004){
              this.examExercisesService.submitComment({emes002:emes002,emes004:data.emes004,emes006:emes001}).subscribe(data=>{
                if(data.resultNum > 0){
                  this.topic['reviewList'] = data.reviewList;
                }
              });
            }else{
              prompt.setSubTitle('评论不能为空！');
              return false;
            }
          }
        }
      ]
    });
    prompt.present();
  }

  //删除评论
  delComment(item){
    this.examExercisesService.delComment(item.EMES001).subscribe(data=>{
      if(data.resultNum > 0){
        this.topic['reviewList'] = this.topic['reviewList'].filter(h => h !== item);
      }
    });
  }

}
