import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {
  AlertController,
  Content, IonicPage, LoadingController, ModalController, NavController, NavParams,
  PopoverController, ViewController
} from 'ionic-angular';
import {OnlineExamService} from "../../../../service/online-exam/OnlineExamService";
import {GlobalData} from "../../../../providers/GlobalData";
import { Storage } from "@ionic/storage";
import {Observable} from "rxjs/Rx";
import {Utils} from "../../../../providers/Utils";
import {NativeService} from "../../../../providers/NativeService";
declare let Swiper: any;
@IonicPage()
@Component({
  selector: 'page-online-exam-test',
  templateUrl: 'online-exam-test.html',
})
export class OnlineExamTestPage {
  items : Array<string> = [];
  answer_key:string;
  egid:string;
  tact001:string;
  is_answer:boolean=true;
  paper = {};
  pageination = {currPage:1,allPage:0};
  slides:any;
  tx : Array<string> = [];
  moonClass:boolean;
  isEnd:boolean;
  testtime:number = 0;
  time:string="00:00";
  timeObser:any;
  testTimeObser:any;
  isAnswer:boolean = false;//标识答题是否全部已答
  fontSize = {
    smaller :'14px',
    default : '16px',
    larger : '18px'
  };
  signatureImg:Array<any> = [];
  remainingTime:number = 0;
  way:string="answer"; //用于显示答题还是背题模式 模拟考试需要
  tact005:number; //考试类型 1：在线考试 9:模拟练习
  @ViewChild(Content) content: Content;
  @ViewChild('popoverContent', { read: ElementRef }) popoverContent: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) popoverText: ElementRef;
  @ViewChild('popoverHeader', { read: ElementRef }) popoverHeader: ElementRef;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public onlineExamService:OnlineExamService,
              public globalData:GlobalData,
              public storage:Storage,
              public modalCtrl: ModalController,
              public popoverCtrl: PopoverController,
              public nativeService:NativeService,
              public viewCtrl:ViewController,
              public alertCtrl:AlertController,
              public loadingCtrl: LoadingController,
              public randerer:Renderer2) {
  }

  ionViewDidLoad() {
    this.initSetting();
    this.initParams();
    this.initData();
  }

  ionViewDidEnter(){
    this.randerer.setStyle(this.popoverText.nativeElement,'min-height',this.content.contentHeight+"px")
  }


  back(){
    this.navCtrl.pop();
  }

  //初始化参数
  initParams(){
    this.tact001 = this.navParams.get("tact001");
    this.tact005 = this.navParams.get("tact005");
  }

  //初始化试卷信息
  initData(){
    this.onlineExamService.examContent(this.tact001).subscribe(data=>{
      this.paper = data.paper;
      this.tx = data.tx;
      if(data.paper.TACT027 == 2){
        this.compareTopic(this.tx,data.topic);
      }else{
        this.items = data.topic;
      }
      this.pageination.allPage = this.items.length;
      this.egid = data.egid;
      this.answer_key = "answer_"+this.globalData.userId+"_"+this.egid;

      this.initSwiper();//初始化swiper
      this.storage.get(this.answer_key).then(data=>{
        this.initCache(data); //初始化缓存信息
        this.initTime();//初始化答题时间
      });
    },err=>{
      this.navCtrl.pop();
    });
  }

  //初始化设置信息
  initSetting(){
    this.storage.get('test_seeting').then(data=>{
      if(data && data.nightModel){
        this.moonClass = true;
      }
      if(data && data.fontSize){
        this.popoverText.nativeElement.style.fontSize = this.fontSize[data.fontSize];
      }
    });
  }

  initCache(data){
    if(data){
      this.pageination.currPage = data.currPage+1 || 1;
      if(this.pageination.currPage > 1 && this.pageination.currPage <=this.pageination.allPage){
        Observable.timer(10).subscribe(data1=>{
          this.slides.slideTo(data.currPage);
        });
      }
      this.testtime =data.testtime-1;
    }else{
      let answer_object = {};
      answer_object['tpid'] = this.tact001;
      answer_object['egid']= this.egid;
      answer_object['topicCount']= this.items.length;
      answer_object['testtime']= 0;
      answer_object['currPage'] = 0;
      this.storage.set(this.answer_key,answer_object);
    }
  }
  initTime(){
    this.intervalTestTime();
    this.startTime();
  }

  startTime(){
    this.calculateTime();
    let tact008 = this.paper['TACT008'];
    this.timeObser =Observable.interval(1000).subscribe(data=>{
      this.calculateTime();
      if(this.remainingTime < 1 && (tact008 === 2 || tact008 === 3)){
        this.autoSubmit();
      }
    });
  }

  calculateTime(){
    this.testtime++
    let tact008 = this.paper['TACT008'];
    if(tact008 === 2){
      let tact009 = this.paper['TACT009']*60;
      this.remainingTime = tact009-this.testtime;
    }else if(tact008 === 3){
      this.remainingTime = this.paper['lefttime'] - this.testtime;
    }else{
      this.remainingTime = this.testtime;
    }
    this.time = Utils.formatSeconds({value:this.remainingTime,formatsp:true,showMinute:true});
  }



  initSwiper(){
    let thiss = this;
    this.slides = new Swiper('.swiper-container',{
      observer:true,
      observeParents:true,
      autoHeight:true,
      roundLengths : true,
      navigation: {
        nextEl: '.button-next',
        prevEl: '.button-prev'
      },
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
        },
        touchEnd(){
          let TR=this.translate;
          let allWidth =(thiss.pageination.allPage-1)*thiss.slides.width;
          if(TR<-allWidth){
            this.setTranslate(TR);
            thiss.openAnswerCard();
          }
        }
      }
    })
  }

  //答题时间(未操作时主动5秒更新一次)
  intervalTestTime(){
    this.testTimeObser =Observable.interval(5000).subscribe(time=>{
      this.updateTestTime();
    });
  }
  //更新答题时间
  updateTestTime(){
    this.storage.get(this.answer_key).then(data=>{
      if(data){
        data.testtime = this.testtime;
        this.storage.set(this.answer_key,data);
      }
    });
  }

  //离开页面处理数据
  ionViewCanLeave(){
    if(this.timeObser){
      this.timeObser.unsubscribe();
    }
    if(this.testTimeObser){
      this.testTimeObser.unsubscribe();
    }

    if(this.slides){
      let currPage = this.slides.activeIndex;
      this.storage.get(this.answer_key).then(data=>{
        if(data){
          data.currPage = currPage;
          data.testtime = this.testtime;
          this.storage.set(this.answer_key,data);
        }
      });
      this.slides.destroy(true,true);
    }
    this.moonClass = false;
  }

  //只加载3道试题
  showSilde(itemIndex){
    if(itemIndex-1 <= this.slides.activeIndex && this.slides.activeIndex <= itemIndex +1){
      return true;
    }
      return false;
  }

  //根据题型排序试题
  compareTopic(tx:Array<string>,list:Array<string>) {
    tx.forEach((v,i)=>{
      list.forEach((v1,i1)=>{
        if(v['BASETYPE'] === v1['BASETYPE']){
          this.items.push(v1);
        }
      })
    })
  }


  //打开答题卡
  openAnswerCard(){
    let answerCard = this.modalCtrl.create('AnswerCardPage',{
      tx:this.tx,
      topic:this.items,
      answer_key:this.answer_key,
      paper:this.paper,
      remainingTime:this.remainingTime,
      testtime:this.testtime
    })
    answerCard.onWillDismiss(data=>{
          if(data){
            if(data.currPage >= 0){
              this.slides.slideTo(data.currPage);
            }

        if(data.submit){
          this.onceSubmitExam();
        }
      }

    });
    answerCard.present();
  }

  //提交试卷提示
  onceSubmitExam(){
    this.submit();
  }

  morePopover(myEvent){
    let thiss = this;
    let popover = this.popoverCtrl.create('MorePopoverPage',{
      textEle:this.popoverText.nativeElement,
      contentEle:this.popoverContent.nativeElement,
      headerEle : this.popoverHeader.nativeElement,
      addMoonClass(flag){
        if(flag){
          thiss.moonClass = true;
        }else{
          thiss.moonClass = false;
        }
      }
    },{cssClass:'morePopover'});
    popover.present({
      ev: myEvent
    });
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

  autoSubmit(){
    this.timeObser.unsubscribe();
    this.nativeService.showLoading('考试时间已到，系统会自动为您交卷。交卷时间较长，请耐心等待...')
    this.submit();
  }

  submit(){
    //获取提交数据
    let thiss = this;
    this.storage.get(this.answer_key).then(data=>{
      let paramsMap = {};
      if(data){
        let answer = "";
        for(let index=0;index<thiss.items.length;index++){
          answer = data['topicId_'+thiss.items[index]['ID']] || '';
          paramsMap['tmdn_'+(index+1)] =answer;
          paramsMap['baseTypeId_'+(index+1)] = thiss.items[index]['BASETYPE'];
          paramsMap['topicId_'+(index+1)] = thiss.items[index]['ID'];
        }
        paramsMap['topicCount'] = thiss.items.length;
        paramsMap['tpid'] = thiss.tact001;
        paramsMap['egid'] = thiss.egid;
        paramsMap['testtime'] = data.testtime;
      }
      this.onlineExamService.submitExam(paramsMap).subscribe(data1=>{
         this.nativeService.hideLoading();
         if(Utils.isNotEmpty(data1.data))
           this.nativeService.alert('','',data1.data,()=>{
             this.storage.remove(this.answer_key);
             this.navCtrl.push('OnlineExamResultPage',{egid:this.egid});
             this.navCtrl.remove(this.navCtrl.indexOf(this.viewCtrl));
             if(this.timeObser){
               this.timeObser.unsubscribe();
             }
             if(this.testTimeObser){
               this.testTimeObser.unsubscribe();
             }
           })
      },error=>{
        this.nativeService.hideLoading();
      });
    });
  }

  //休息一下
  haveRest(){
    if(this.tact005 !== 9){
      return;
    }
    this.getAnswered();
  }

  //获取已答试题
  getAnswered(){
    this.storage.get(this.answer_key).then(data=>{
      let answerNum:number = 0;
      if(data){
        let answer = "";
        for(let i=0;i<this.items.length;i++){
          answer = data['topicId_'+this.items[i]['ID']];
          if(Utils.isNotEmpty(answer)){
            answerNum++;
          }
        }
      }
      this.showHaveRest(answerNum);
    });
  }

  //弹出休息一下窗口页面
  showHaveRest(answerNum){
    if(this.timeObser){
      this.timeObser.unsubscribe();
    }
    if(this.testTimeObser){
      this.testTimeObser.unsubscribe();
    }
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<div class="restTitle">休息一下</div><div class="restContent">共<i ion-text class="primary">${this.pageination.allPage}</i>道题,还剩<i ion-text class="danger">${this.pageination.allPage-answerNum}</i>道题未做</div>`,
      enableBackdropDismiss:true,
      cssClass : 'rest'
    });
    loading.present();

    loading.onDidDismiss(() => {
      this.initTime();//开启时间
    });
  }
}

