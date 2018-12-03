import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {
  AlertController, Content, IonicPage, LoadingController, ModalController,
  NavController, NavParams, PopoverController, ViewController
} from 'ionic-angular';
import {GlobalData} from "../../../../providers/GlobalData";
import {Storage} from "@ionic/storage";
import {Observable} from "rxjs/Rx";
import {Utils} from "../../../../providers/Utils";
import {NativeService} from "../../../../providers/NativeService";
import {OnlineQuestionnaireService} from "../../../../service/online-questionnaire/OnlineQuestionnaireService";
import {QuestionnaireAnswerCardPage} from "../questionnaire-answer-card/questionnaire-answer-card";
import {QuestionnaireMorePopoverPage} from "../questionnaire-more-popover/questionnaire-more-popover";
import {StartevaluationPage} from "../../../work/assistant/taskevaluation/startevaluation/startevaluation";
//import {QuestionnaireResultPage} from "../questionnaire-result/questionnaire-result";

declare let Swiper: any;


@IonicPage()
@Component({
  selector: 'page-questionnaire-test',
  templateUrl: 'questionnaire-test.html',
})
export class QuestionnaireTestPage {
  items: any = [];
  answer_key: string;
  egid: string;
  ques001: string = '';//调查ID
  is_answer: boolean = true;
  paper = {};
  pageination = {currPage: 1, allPage: 0};
  slides: any;
  tx: any = [];
  moonClass: boolean;
  isEnd: boolean;
  testtime: number = 0;
  time: string = "00:00";
  timeObser: any;
  testTimeObser: any;
  ques009: string = '';//是否允许查看结果：0、不允许 1、允许 DEF(0)
  //isAnswer:boolean = false;//标识答题是否全部已答
  topic: any = [];//试题信息
  fontSize = {
    smaller: '14px',
    default: '16px',
    larger: '18px'
  };
  signatureImg: Array<any> = [];
  remainingTime: number = 0;
  slidesItem:any;
  @ViewChild(Content) content: Content;
  @ViewChild('popoverContent', {read: ElementRef}) popoverContent: ElementRef;
  @ViewChild('popoverText', {read: ElementRef}) popoverText: ElementRef;
  @ViewChild('popoverHeader', {read: ElementRef}) popoverHeader: ElementRef;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public onlineQuestionnaireService: OnlineQuestionnaireService,
              public globalData: GlobalData,
              public storage: Storage,
              public modalCtrl: ModalController,
              public popoverCtrl: PopoverController,
              public nativeService: NativeService,
              public viewCtrl: ViewController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public randerer: Renderer2) {
  }

  ionViewDidLoad() {
    this.initSetting();
    this.initParams();
    this.initData();
  }

  ionViewDidEnter() {
    this.randerer.setStyle(this.popoverText.nativeElement, 'min-height', this.content.contentHeight + "px")
  }


  back() {
    this.navCtrl.pop();
  }

  //初始化参数
  initParams() {
    this.ques001 = this.navParams.get("QUES001");
    this.ques009 = this.navParams.get("QUES009");
  }

  //初始化试卷信息
  initData() {
    this.onlineQuestionnaireService.questionnaireContent(this.ques001).subscribe(data => {
      this.paper = data.paper;//试卷信息
      this.tx = data.knowledgeList;
      this.items = data.topic;
      this.pageination.allPage = this.items.length;
      this.initSwiper();//初始化swiper
      //this.slides=this.slidesItem[0];
      this.answer_key = "answer_" + this.globalData.userId + "_" + this.ques001;
      this.topic = data.topic;
      this.storage.get(this.answer_key).then(data => {
        this.initCache(data); //初始化缓存信息
        this.initTime();//初始化答题时间
      });
    }, err => {
      this.navCtrl.pop();
    });
  }

  //初始化设置信息
  initSetting() {
    this.storage.get('test_seeting').then(data => {
      if (data && data.nightModel) {
        this.moonClass = true;
      }
      if (data && data.fontSize) {
        this.popoverText.nativeElement.style.fontSize = this.fontSize[data.fontSize];
      }
    });
  }

  initCache(data) {
    if (data) {
      this.pageination.currPage = data.currPage + 1 || 1;
      if (this.pageination.currPage > 1 && this.pageination.currPage <= this.pageination.allPage) {
        Observable.timer(10).subscribe(data1 => {
          this.slides.slideTo(data.currPage);
        });
      }
      this.testtime = data.testtime - 1;
    } else {
      let answer_object = {};
      answer_object['tpid'] = this.ques001;
      answer_object['topicCount'] = this.items.length;
      answer_object['testtime'] = 0;
      answer_object['currPage'] = 0;
      this.storage.set(this.answer_key, answer_object);
    }
  }

  initTime() {
    this.intervalTestTime();
    // let ques006 = this.paper['QUES006'];
    // if(ques006==1){//	计时选项：1：不计时 2：计时
    //   this.startTime();
    // }
    this.startTime();
  }

  startTime() {
    this.timeObser = Observable.interval(1000).subscribe(data => {
      this.calculateTime();
    });
  }

  calculateTime() {
    this.testtime++;
    this.time = Utils.formatSeconds({value: this.testtime, formatsp: true, showMinute: true});
  }


  initSwiper() {

    let thiss = this;
    this.slides = new Swiper('.swiper-container1', {
      observer: true,
      observeParents: true,
      autoHeight: true,
      roundLengths: true,
      navigation: {
        nextEl: '.button-next',
        prevEl: '.button-prev'
      },
      on: {
        transitionStart() {
          thiss.is_answer = false;
        },
        transitionEnd() {
          thiss.is_answer = true;
          console.warn(this.activeIndex+'------------');
          if (this.activeIndex >= thiss.pageination.allPage) {
            thiss.pageination.currPage = thiss.pageination.allPage;
          } else {
            thiss.pageination.currPage = this.activeIndex + 1;
          }
          thiss.content.scrollToTop();
        },
        touchEnd() {
          let TR = this.translate;
          let allWidth = (thiss.pageination.allPage - 1) * thiss.slides.width;
          if (TR < -allWidth) {
            this.setTranslate(TR);
            thiss.openAnswerCard();
          }
        }
      }
    })
  }

  //答题时间(未操作时主动5秒更新一次)
  intervalTestTime() {
    this.testTimeObser = Observable.interval(5000).subscribe(time => {
      this.updateTestTime();
    });
  }

  //更新答题时间
  updateTestTime() {
    this.storage.get(this.answer_key).then(data => {
      if (data) {
        data.testtime = this.testtime;
        this.storage.set(this.answer_key, data);
      }
    });
  }

  //离开页面处理数据
  ionViewCanLeave() {
    if (this.timeObser) {
      this.timeObser.unsubscribe();
    }
    if (this.testTimeObser) {
      this.testTimeObser.unsubscribe();
    }

    if (this.slides) {
      let currPage = this.slides.activeIndex;
      this.storage.get(this.answer_key).then(data => {
        if (data) {
          data.currPage = currPage;
          data.testtime = this.testtime;
          this.storage.set(this.answer_key, data);
        }
      });
      this.slides.destroy(true, true);
    }
    this.moonClass = false;
  }

  //只加载3道试题
  showSilde(itemIndex) {
    if (itemIndex - 1 <= this.slides[0].activeIndex && this.slides[0].activeIndex <= itemIndex + 1) {
      return true;
    }
    return false;
  }

  //根据题型排序试题
  compareTopic(tx: Array<string>, list: Array<string>) {
    tx.forEach((v, i) => {
      list.forEach((v1, i1) => {
        if (v['BASETYPE'] === v1['BASETYPE']) {
          this.items.push(v1);
        }
      })
    })
  }


  //打开答题卡
  openAnswerCard() {
    let answerCard = this.modalCtrl.create('QuestionnaireAnswerCardPage', {
      tx: this.tx,
      topic: this.items,
      answer_key: this.answer_key,
      paper: this.paper,
      remainingTime: this.remainingTime,
      testtime: this.testtime
    });
    answerCard.onWillDismiss(data => {
      if (data) {
        if (data.currPage >= 0) {
          this.slides.slideTo(data.currPage);
        }

        if (data.submit) {
          this.onceSubmitExam();
        }
      }

    });
    answerCard.present();
  }


  morePopover(myEvent) {
    let thiss = this;
    let popover = this.popoverCtrl.create('QuestionnaireMorePopoverPage', {
      textEle: this.popoverText.nativeElement,
      contentEle: this.popoverContent.nativeElement,
      headerEle: this.popoverHeader.nativeElement,
      addMoonClass(flag) {
        if (flag) {
          thiss.moonClass = true;
        } else {
          thiss.moonClass = false;
        }
      }
    }, {cssClass: 'morePopover'});
    popover.present({
      ev: myEvent
    });
  }

  //草稿
  openSignatureBoard() {
    let signatureBoard = this.modalCtrl.create('SignatureBoardPage', {
      isMoon: true,
      signatureImg: this.signatureImg
    });
    signatureBoard.onWillDismiss(data => {
      if (data) {
        this.signatureImg = data.signatureImg;
      }
    });
    signatureBoard.present();
  }

  //提交试卷提示
  onceSubmitExam() {
    this.submit();
  }

  submit() {
    //获取提交数据
    let thiss = this;
    this.storage.get(this.answer_key).then(data => {
      let paramsMap = {};
      let content = {};
      if (data) {
        let answer = "";
        for (let index = 0; index < thiss.items.length; index++) {
          answer = data['topicId_' + thiss.items[index]['QTID']] || '';
          content['tmdn_' + (index)] = answer;
          content['baseTypeId_' + (index)] = thiss.items[index]['BASETYPE'];
          content['topicId_' + (index)] = thiss.items[index]['QTID'];
        }
        content['topicCount'] = thiss.items.length;
        content['testtime'] = data.testtime;
        paramsMap['QUES001'] = thiss.ques001;
        paramsMap['CONTENT'] = JSON.stringify(content);

      }
      this.storage.remove(this.answer_key);//移除缓存
      /*******清空记录时间******/
      if (this.timeObser) {
        this.timeObser.unsubscribe();
      }
      if (this.testTimeObser) {
        this.testTimeObser.unsubscribe();
      }
      /*******清空记录时间******/
      this.onlineQuestionnaireService.submitQuestionnaire(paramsMap).subscribe(data1 => {
        this.nativeService.hideLoading();
        this.storage.remove(this.answer_key);//移除缓存
        /*******清空记录时间******/
        if (this.timeObser) {
          this.timeObser.unsubscribe();
        }
        if (this.testTimeObser) {
          this.testTimeObser.unsubscribe();
        }
        //this.navCtrl.push('QuestionnaireListPage'); StartevaluationPage
        //this.navCtrl.push('StartevaluationPage');
        this.navCtrl.pop();
        this.navCtrl.remove(this.navCtrl.indexOf(this.viewCtrl));
        /*******备用---查看统计分析页面******/
        // if (this.ques009 == '1') {//不允许查看答案
        //   this.navCtrl.push('QuestionnaireListPage');
        //   this.navCtrl.remove(this.navCtrl.indexOf(this.viewCtrl));
        // } else if (this.ques009 == '0') {//允许查看答案
        //   this.navCtrl.push('QuestionnaireResultPage', {QUES001: thiss.ques001, TOPIC: this.topic});
        //   this.navCtrl.remove(this.navCtrl.indexOf(this.viewCtrl));
        // } else {//其他
        //   this.navCtrl.push('QuestionnaireResultPage', {QUES001: thiss.ques001, TOPIC: this.topic});
        //   this.navCtrl.remove(this.navCtrl.indexOf(this.viewCtrl));
        // }

      }, error => {
        this.nativeService.hideLoading();
      });
    });
  }

  //休息一下
  haveRest() {
    this.getAnswered();
  }

  //获取已答试题
  getAnswered() {
    this.storage.get(this.answer_key).then(data => {
      let answerNum: number = 0;
      if (data) {
        let answer = "";
        for (let i = 0; i < this.items.length; i++) {
          answer = data['topicId_' + this.items[i]['ID']];
          if (Utils.isNotEmpty(answer)) {
            answerNum++;
          }
        }
      }
      this.showHaveRest(answerNum);
    });
  }

  //弹出休息一下窗口页面
  showHaveRest(answerNum) {
    if (this.timeObser) {
      this.timeObser.unsubscribe();
    }
    if (this.testTimeObser) {
      this.testTimeObser.unsubscribe();
    }
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<div class="restTitle">休息一下</div><div class="restContent">共<i ion-text class="primary">${this.pageination.allPage}</i>道题,还剩<i ion-text class="danger">${this.pageination.allPage - answerNum}</i>道题未做</div>`,
      enableBackdropDismiss: true,
      cssClass: 'rest'
    });
    loading.present();
    loading.onDidDismiss(() => {
      this.initTime();//开启时间
    });
  }
}

