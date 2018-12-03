import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AlertController, Events, NavController, NavParams, ToastController} from 'ionic-angular';
import {Topic} from "../../../../model/Topic";
import {Storage} from "@ionic/storage";
import {GlobalData} from "../../../../providers/GlobalData";
import {Utils} from "../../../../providers/Utils";
import {Observable} from "rxjs/Rx";
import {StandardsTrainServices} from "../../../../service/standards-train/StandardsTrainServices";
import {NativeService} from "../../../../providers/NativeService";


@Component({
  selector: 'page-standards-train-topic',
  templateUrl: 'standards-train-topic.html',
})
export class StandardsTrainTopicPage{

  @Input()topic: Topic; //试题对象
  @Input()answer_key:string; //答题结果key
  @Input()topic_index:number; //当前题数
  @Input()is_answer:boolean;//滑动过程是否可答题
  @Input()slides:any;
  @Input()paper:any; //题库练习信息
  @Input()pageination:any; //试题题号对象
  @Input()extg001:string;//成绩id
  @Input() items : Array<Topic> = []; //展示试题列表

  @Output()heightChange = new EventEmitter();
  @Output()itemsChange = new EventEmitter();


  current_answer_index:number;//单选当前选中答题选项下标
  answer_object:any; //答题对象
  multi_answer_index = {}; //多选题题多个答题结果选项
  multi_index = {}; //多选当前选中答题选项下标
  current_index:number; //单选当前选中答题选项下标（背景色标识）
  disabled:boolean = false;//解决重复答题跳转试题(单选题)或解决当前试题只能答一次
  answerResult:boolean; //答题是否正确
  showWay:string = ""; //是否显示答案信息

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage:Storage,
              public globalData:GlobalData,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public standardsTrainServices:StandardsTrainServices,
              public nativeService:NativeService,
              public events: Events) {

  }

  ngAfterViewInit(){
    //回显已答数据
    this.storage.get(this.answer_key).then(data=>{//获取缓存数据
      this.answer_object = data || {};
      this.answer_show_cache();
    });
  }

  answer_show_cache(){
    let answer = this.answer_object["topicId_"+this.topic.ID];
    if(Utils.isNotEmpty(answer)){
      if(this.topic.BASETYPE === 1 || this.topic.BASETYPE === 3){
        this.current_answer_index = Utils.getNumber(answer)-1;
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
      this.showWay = answerResult;
    }
  }

  //答题

  answer_question(ev:any,option_index,flag?:boolean){
    if(!this.is_answer || this.disabled){
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
        subscription.unsubscribe();
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

  updateRightError(){
    this.disabled = true;
    let errorItems :Array<Topic>  = this.answer_object['errorItems'] || [];
    if(this.answerResult){
      this.answer_object['answer_result_'+this.topic.ID] ='right';
      this.showWay = 'right';
      errorItems = errorItems.filter(res=>res.ID != this.topic.ID);
    }else{
      this.answer_object['answer_result_'+this.topic.ID] ='error';
      this.showWay = 'error';
      let item = errorItems.find(res=>res.ID == this.topic.ID);
      if(!item){
        errorItems.push(this.topic);
      }
    }
    this.answer_object['errorItems'] = errorItems;
    this.storage.set(this.answer_key,this.answer_object);
    //验证达标训练是否达标
    setTimeout(()=>{
      this.isStandard();
    },30)

  }

  //验证达标训练是否达标
  isStandard(){
    if(this.slides.isEnd){ //最后一题进行统计是否达标
      //获取答题记录
      this.storage.get(this.answer_key).then(data=>{//获取缓存数据
        this.answer_object = data || {};
        let rightNumber = 0;//答对数量
        let answerNumber = 0;//已答数量

        for(var str in this.answer_object){
          if(str.indexOf('answer_result_') != -1){
            answerNumber++;
            if(this.answer_object[str] == 'right')
              rightNumber++;
          }
        }
        //获取练习已做正确率
        let rightRate = rightNumber*100/this.pageination.allPage;
        //获取练习达标率
        let est013 = this.paper.est013 || 100;
        //若试题全部答对将提示训练达标且结束
        if(rightRate >= est013){ //未达标将重新答题
          if(rightNumber === this.pageination.allPage){
            this.standardsTrainServices.updateStandardsInfo({extg001:this.extg001,extg009:rightRate}).subscribe(data=>{
              this.nativeService.alert('','','恭喜您通过该达标训练',()=>{
                this.storage.remove(this.answer_key);
                this.navCtrl.goToRoot({animate:true,direction:'back'});
              })
            });
          }else{
            this.globalData.showLoading = false;
            this.standardsTrainServices.updateProgress({extg001:this.extg001,extg009:rightRate}).subscribe(data=>{

            });
            setTimeout(()=>{
              this.globalData.showLoading = true;
            },10);
            this.showLastTopicPrompt(0,);
          }
        }else{
          this.showLastTopicPrompt(1);

        }
      })
    }
  }

  showLastTopicPrompt(val){
    if(val === 1){
      delete this.answer_object['errorItems'];
    }else{
      this.items = this.answer_object['errorItems'];
    }
    for(var i=0;i<this.items.length;i++){
      delete this.answer_object['topicId_'+this.items[i].ID];
      delete this.answer_object['answer_result_'+this.items[i].ID];
    }
    this.storage.set(this.answer_key,this.answer_object);
    let toast = this.toastCtrl.create({
      message: '已经是最后一题了,确定后将继续答错的试题。',
      showCloseButton:true,
      closeButtonText:'确定',
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      this.itemsChange.emit(val);
    });
    toast.present();
  }

  ngAfterViewChecked() {
    if (this.disabled) {
      this.heightChange.emit();
    }
  }


  //确认答案
  confirmAnswer(){
    this.storage.get(this.answer_key).then(data=>{//获取缓存数据
      //验证答题是否为空
      this.answer_object = data || {};
      let answer = this.answer_object["topicId_"+this.topic.ID];
      if(Utils.isEmpty(answer)){
        let toast = this.toastCtrl.create({
          message: '请选择答案！',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        return;
      }
      answer = answer.split("").sort().join("");
      if(answer ==  this.topic.TOPICKEY)
        this.answerResult = true;
      else
        this.answerResult = false;
      this.updateRightError();
    })
  }


}
