import {Component, ElementRef,  Renderer2, ViewChild} from '@angular/core';
import {
  Content, Events, IonicPage, ModalController, NavController, NavParams, PopoverController, ToastController,
  ViewController
} from 'ionic-angular';
import {StandardsTrainServices} from "../../../../service/standards-train/StandardsTrainServices";
import {Storage} from "@ionic/storage";
import {GlobalData} from "../../../../providers/GlobalData";
import {NativeService} from "../../../../providers/NativeService";
import {Utils} from "../../../../providers/Utils";
import {Observable} from "rxjs/Rx";
import {Topic} from "../../../../model/Topic";
declare let Swiper: any;

@IonicPage()
@Component({
  selector: 'page-standards-train-test',
  templateUrl: 'standards-train-test.html',
})
export class StandardsTrainTestPage{

  est001:string; //达标训练id
  extg001:string; //成绩id
  paper = {}; //试卷信息
  tx : Array<string> = []; //题型
  items : Array<Topic> = []; //展示试题列表
  allItems: Array<Topic> = []; //所有试题
  errorItems : Array<Topic> = []; //答错试题列表
  pageination = {currPage:1,allPage:0}; //当前页码/所有页码
  slides:any; //swiper
  answer_key:string;//缓存key
  is_answer:boolean=true; //是否可以答题、防止滑屏时答题
  signatureImg:Array<any> = [];
  testtime:number = 0;
  time:string="00:00";
  timeObser:any;
  height:string;
  isError:boolean = false;//是否从错题中答题
  extg009:number;
  errorIndex:number = 0;
  @ViewChild(Content) content: Content;
  @ViewChild('popoverContent', { read: ElementRef }) popoverContent: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) popoverText: ElementRef;
  @ViewChild('popoverHeader', { read: ElementRef }) popoverHeader: ElementRef;
  constructor(public navCtrl: NavController,
               public navParams: NavParams,
               public standardsTrainServices:StandardsTrainServices,
                public globalData:GlobalData,
                public storage:Storage,
              public modalCtrl: ModalController,
              public popoverCtrl: PopoverController,
              public nativeService:NativeService,
              public viewCtrl:ViewController,
              public randerer:Renderer2,
              private toastCtrl: ToastController,
              public events: Events) {
  }


  ionViewDidLoad() {
    this.initParams();
    this.initData();
  }

  ionViewDidEnter(){
    this.randerer.setStyle(this.popoverText.nativeElement,'min-height',this.content.contentHeight+"px")
  }

  heightChange() {
    let swiperActive = this.popoverText.nativeElement.querySelector('.swiper-slide-active');
    this.randerer.setStyle(this.slides.$wrapperEl[0], 'height', swiperActive.clientHeight);
    this.slides.update();
  }
  /**
   * 初始化参数
   */
  initParams(){
    this.est001 = this.navParams.get("est001") || '';
  }

  /**
   * 初始化达标训练试题数据
   */
  initData(){
    this.standardsTrainServices.examContent(this.est001).subscribe(data=>{
      this.paper = data.paper;
      this.tx = data.tx;
      this.items = data.topicList;
      this.allItems = data.topicList;
      this.pageination.allPage = this.allItems.length;
      this.extg001 = data.trainGrade.extg001;
      this.extg009 = data.trainGrade.extg009 || 0;
      this.answer_key = "answer_"+this.globalData.userId+"_"+this.extg001;
      this.initSwiper();//初始化swiper
      this.initCache(); //初始化缓存信息
      this.initTime();//初始化答题时间
    },err=>{
      this.navCtrl.pop();
    });
  }

  initTime(){
    this.storage.get(this.answer_key).then(data=>{
      data = data || {};
      if(data){
        this.testtime = data.testtime || 0;
        this.calculateTime();
        this.startTime();
      }
    });
  }

  calculateTime(){
    this.time = Utils.formatSeconds({value:this.testtime++,formatsp:true,showMinute:true});
  }

  startTime(){
    this.timeObser =Observable.interval(1000).subscribe(data=>{
      this.calculateTime();
    });
  }

  initSwiper(){
    let thiss = this;
    this.slides = new Swiper('.swiper-container',{
      observer:true,
      observeParents:true,
      roundLengths : true,
      autoHeight:true,
      noSwiping : true,
      noSwipingClass : 'stop-swiping',
      on:{
        transitionStart() {
          thiss.is_answer = false;
        },
        transitionEnd() {
          thiss.is_answer = true;
          if(this.activeIndex >= thiss.pageination.allPage){
            thiss.pageination.currPage = thiss.pageination.allPage;
          }else{
            thiss.pageination.currPage = this.activeIndex+1;
          }
          thiss.content.scrollToTop();
        }
      }
    })
  }

  initCache(){//初始化缓存信息
    this.storage.get(this.answer_key).then(data=>{
      let answer_object = data ||{};
      if(data){
        let item = answer_object['errorItems'];
        if(item && this.extg009 >= this.paper['est013']){
            this.items = item;
        }
        this.pageination.currPage = answer_object.currPage+1 || 1;
        if(this.pageination.currPage > 1 && this.pageination.currPage <=this.pageination.allPage){
          Observable.timer(10).subscribe(data1=>{
            this.slides.slideTo(answer_object.currPage);
          });
        }
        this.testtime =answer_object.testtime-1;
      }else{
        answer_object['testtime']= 0;
        answer_object['currPage'] = 0;
        this.storage.set(this.answer_key,answer_object);
      }
    });
  }

  //只加载3道试题
  showSilde(itemIndex){
    if(itemIndex-1 <= this.slides.activeIndex && this.slides.activeIndex <= itemIndex +1){
      return true;
    }
    return false;
  }

  itemsChange(val){
    this.storage.get(this.answer_key).then(data=> {//获取缓存数据
     let answer_object = data || [];
      if(answer_object){
        if(val === 0){
          this.items = answer_object['errorItems'];
        }
        setTimeout(()=>{
          this.slides.slideTo(0);
        },10);
      }
    });
  }

  //下一题
  nextTopic(){
    this.storage.get(this.answer_key).then(data=>{//获取缓存数据
      //验证答题是否为空
      data = data || {};
      let topic = this.items[this.slides.activeIndex];
      let answer = data["answer_result_"+topic['ID']];
      if(Utils.isEmpty(answer)){
        let toast = this.toastCtrl.create({
          message: '请先确认答案！',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        return;
      }
      this.slides.slideNext();
    })
  }

  //返回
  back(){
    this.navCtrl.pop();
  }

  //草稿
  openSignatureBoard(){
    let signatureBoard = this.modalCtrl.create('SignatureBoardPage',{
      isMoon:true,
      signatureImg:this.signatureImg
    })
    signatureBoard.onWillDismiss(data=>{
      if(data){
        this.signatureImg = data.signatureImg;
      }
    });
    signatureBoard.present();
  }

  //打开答题卡
  openAnswerCard(){
    let answerCard = this.modalCtrl.create('StandardsTrainAnswerCardPage',{
      tx:this.tx,
      topic:this.allItems,
      answer_key:this.answer_key,
      testtime:this.testtime
    })
    answerCard.present();
  }


  //离开页面处理数据
  ionViewCanLeave(){
    if(this.timeObser){
      this.timeObser.unsubscribe();
    }

    this.storage.get(this.answer_key).then(data=>{
      if(data){
        data.testtime = this.testtime;
        data.currPage = this.slides.activeIndex;
        this.storage.set(this.answer_key,data);
      }
    });
  }
}
