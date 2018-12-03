import {Component, ElementRef, Input} from '@angular/core';
import {Topic} from "../../../../model/Topic";
import {Observable} from "rxjs";
import {Storage} from "@ionic/storage";
import {Utils} from "../../../../providers/Utils";
import {PopoverController} from "ionic-angular";
import {QuestionnaireTopic} from "../../../../model/QuestionnaireTopic";

@Component({
  selector: 'questionnaire-topic',
  templateUrl: 'questionnaire-topic.html'
})
export class QuestionnaireTopicComponent {
  @Input() topic: QuestionnaireTopic; //试题对象
  @Input() answer_key: string; //答题结果key
  @Input() topic_index: number; //当前题数
  @Input() is_answer: boolean;//滑动过程是否可答题
  @Input() slides: any;
  @Input() paper: any; //试卷信息
  @Input() pageination: any; //试题题号对象
  @Input() way: string = 'answer';
  current_answer_index: number;//单选当前选中答题选项下标
  current_index: number; //单选当前选中答题选项下标（背景色标识）
  multi_index = {}; //多选当前选中答题选项下标
  uncert: string;
  essay: string; //问答题答题结果
  multi_answer_index = {}; //多选题题多个答题结果选项
  answer_object: any; //答题对象
  topic_answer: string; //答案
  disabled: boolean = false;//解决重复答题跳转试题(单选题)
  constructor(public storage: Storage,
              public popoverCtrl: PopoverController,
              public elementRef: ElementRef) {

  }

  ngAfterViewInit() {
    //回显已答数据
    this.storage.get(this.answer_key).then(data => {//获取缓存数据
      this.answer_object = data || {};
      this.answer_show_cache();
      this.initUncert();
    });
  }

  answer_show_cache() {
    let answer = this.answer_object["topicId_" + this.topic.QTID];
    if (Utils.isNotEmpty(answer)) {
      if (this.topic.BASETYPE === 1 || this.topic.BASETYPE === 3) {
        this.current_answer_index = Utils.getNumber(answer) - 1;
      } else if (this.topic.BASETYPE === 4) {
        this.essay = answer;
      } else if (this.topic.BASETYPE == 2 || this.topic.BASETYPE == 7) {
        answer = answer.split("");
        let thiss = this;
        answer.forEach(function (item) {
          thiss.multi_answer_index['multi_' + (Utils.getNumber(item) - 1)] = Utils.getNumber(item) - 1;
        });
      }
    }
  }

  //初始化不定项选择
  initUncert() {
    if (this.answer_object['uncert_' + this.topic.QTID]) {
      this.uncert = "#ffc125";
    } else {
      this.uncert = "";
    }
  }

  answer_question(ev: any, option_index, flag?: boolean) {
    if (!this.is_answer || this.disabled) {
      ev.preventDefault();
      return;
    }
    if (this.topic.BASETYPE == 1 || this.topic.BASETYPE == 3) { //单选题
      this.disabled = true;
      this.current_index = option_index;
      let subscription = Observable.timer(300).subscribe(data => {
        this.current_index = -1;
        if (flag) this.current_answer_index = option_index;
        subscription = Observable.timer(300).subscribe(data => {
          this.slides.slideTo(this.slides.activeIndex + 1);
          this.disabled = false;
          subscription.unsubscribe();
        })

      });

    } else if (this.topic.BASETYPE == 2 || this.topic.BASETYPE == 7) {
      this.multi_index['multi_' + option_index] = option_index;
      Observable.timer(300).subscribe(data => {
        this.multi_index['multi_' + option_index] = -1;
        if (flag)
          this.multi_answer_index['multi_' + option_index] = this.multi_answer_index['multi_' + option_index] == option_index ? -1 : option_index;
      });
    }

    flag && this.storage.get(this.answer_key).then(data => {//获取缓存数据
      this.answer_object = data || {};
      if (this.topic.BASETYPE == 1 || this.topic.BASETYPE == 3)
        flag && this.dealBaseType1();
      else if (this.topic.BASETYPE == 2 || this.topic.BASETYPE == 7)
        flag && this.dealBaseType2(option_index);
    })
  }


  //单选题、判断题数据处理
  dealBaseType1() {
    this.answer_object['topicId_' + this.topic.QTID] = Utils.letter(this.current_index + 1);
    this.storage.set(this.answer_key, this.answer_object);
  }

  //多选题、不定项题数据处理
  dealBaseType2(option_index: number) {
    let flag = this.multi_answer_index['multi_' + option_index] == option_index ? true : false; //验证当前是选中还是未选中
    let answer = this.answer_object['topicId_' + this.topic.QTID] || '';
    option_index++;
    if (flag) {
      if (answer.indexOf(Utils.letter(option_index)) >= 0)
        answer = answer.replace(Utils.letter(option_index), "");
    } else {
      if (answer.indexOf(Utils.letter(option_index)) <= 0)
        answer = answer + Utils.letter(option_index);
    }
    this.answer_object['topicId_' + this.topic.QTID] = answer;
    this.storage.set(this.answer_key, this.answer_object);
  }

  answer_essay($event) {
    this.storage.get(this.answer_key).then(data => {//获取缓存数据
      this.answer_object = data || {};
      this.answer_object['topicId_' + this.topic.QTID] = $event.target.value;
      this.storage.set(this.answer_key, this.answer_object);
    });
  }

  selectedUncert() {
    this.storage.get(this.answer_key).then(data => {//获取缓存数据
      this.answer_object = data || {};
      this.answer_object['uncert_' + this.topic.QTID] = !this.answer_object['uncert_' + this.topic.QTID];
      if (this.answer_object['uncert_' + this.topic.QTID]) {
        this.uncert = "#ffc125";
      } else {
        this.uncert = "";
      }
      this.storage.set(this.answer_key, this.answer_object);
    });

  }

}
