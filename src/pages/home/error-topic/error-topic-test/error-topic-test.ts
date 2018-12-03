import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {
  Content, IonicPage, LoadingController, ModalController, NavController, NavParams, PopoverController,
  ViewController
} from 'ionic-angular';
import {ErrorTopicService} from "../../../../service/error-topic/ErrorTopicService";
import {GlobalData} from "../../../../providers/GlobalData";
import {Storage} from "@ionic/storage";
import {NativeService} from "../../../../providers/NativeService";
import {Observable} from "rxjs/Rx";
import {Utils} from "../../../../providers/Utils";
declare let Swiper: any;

@IonicPage()
@Component({
  selector: 'page-error-topic-test',
  templateUrl: 'error-topic-test.html',
})
export class ErrorTopicTestPage {
  topi003:string;//知识点
  exsa001:string;//抽题id
  randomTopicNum:number;//抽题数量
  moonClass:boolean;//设置夜间模式
  items : Array<string> = []; //题库试题
  pageination = {currPage:1,allPage:0,rightNum:0,errorNum:0,accuracy:0}; //当前页码/所有页码、正确数、错误数、正确率
  slides:any; //swiper
  tx : Array<string> = []; //题型集合
  answer_key:string;//缓存key
  fontSize = {
    smaller :'14px',
    default : '16px',
    larger : '18px'
  }; //字体大小
  is_answer:boolean=true; //是否可以答题、防止滑屏时答题
  way:string="answer"; //用于显示答题还是背题模式
  signatureImg:Array<any> = [];
  @ViewChild(Content) content: Content;
  @ViewChild('popoverContent', { read: ElementRef }) popoverContent: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) popoverText: ElementRef;
  @ViewChild('popoverHeader', { read: ElementRef }) popoverHeader: ElementRef;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public globalData:GlobalData,
              public storage:Storage,
              public errorTopicService:ErrorTopicService,
              public modalCtrl: ModalController,
              public popoverCtrl: PopoverController,
              public nativeService:NativeService,
              public viewCtrl:ViewController,
              public loadingCtrl: LoadingController,
              public randerer:Renderer2) {

  }

  ionViewDidLoad() {
    this.initParams();
    this.initData();
  }

  //初始化参数
  initParams(){
    this.topi003 = this.navParams.get("topi003") || "";
    this.exsa001 = this.navParams.get("exsa001") || "";
    this.randomTopicNum = this.navParams.get("randomTopicNum") || 0;
  }

  ionViewDidEnter(){
    this.randerer.setStyle(this.popoverText.nativeElement,'min-height',this.content.contentHeight+"px")
  }

  //初始化错题
  initData(){
    this.errorTopicService.getErrorTopicContent({topi003:this.topi003,exsa001:this.exsa001,randomTopicNum:this.randomTopicNum}).subscribe(data=>{
      if(data){
        this.items = data.list;
        this.tx = data.txList;
        this.exsa001 = data.exsa001;
        this.pageination.allPage = this.items.length;
        this.answer_key = "error_topic_"+this.globalData.userId+"_"+ this.exsa001;
        this.initSwiper();//初始化swiper
        this.initCache(); //初始化缓存信息
      }

    });
  }

  initSwiper(){
    let thiss = this;
    this.slides = new Swiper('.swiper-container',{
      observer:true,
      observeParents:true,
      roundLengths : true,
      navigation: {
        nextEl: '.button-next',
        prevEl:'.button-prev'
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
            /*thiss.openAnswerCard();*/
          }
        }
      }
    })
  }

  initCache(){//初始化缓存信息
    this.storage.get(this.answer_key).then(data=>{
      if(data){
        this.pageination.currPage = data.currPage+1 || 1;
        if(this.pageination.currPage > 1 && this.pageination.currPage <=this.pageination.allPage){
          Observable.timer(10).subscribe(data1=>{
            this.slides.slideTo(data.currPage);
          });
        }
        this.initAnswerNum(data);
      }else{
        let answer_object = {};
        answer_object['exsa001'] = this.exsa001;
        answer_object['topicCount']= this.items.length;
        answer_object['currPage'] = 0;
        this.storage.set(this.answer_key,answer_object);
      }
    });
  }

  //初始化答题结果正确数量、错题数量、正确率
  initAnswerNum(data){
    this.pageination.rightNum = this.pageination.errorNum = 0;
    for(var str in data){
      if(str.indexOf('answer_result_') != -1)
        if(data[str] == 'right')
          this.pageination.rightNum++;
        else if(data[str] == 'error')
          this.pageination.errorNum++;
        continue;
    }
    this.pageination.accuracy = this.pageination.rightNum === 0?0:parseFloat((this.pageination.rightNum*100/(this.pageination.rightNum+this.pageination.errorNum)).toFixed(2));
  }

  back(){
    this.navCtrl.push('ErrorTopicListPage');
    let viewIndex = this.navCtrl.indexOf(this.viewCtrl);
    this.navCtrl.remove(viewIndex);
    this.navCtrl.remove(viewIndex-1);
  }

  //只加载3道试题
  showSilde(itemIndex){
    if(itemIndex-1 <= this.slides.activeIndex && this.slides.activeIndex <= itemIndex +1){
      return true;
    }
    return false;
  }

  //打开答题卡
  openAnswerCard(){
    let answerCard = this.modalCtrl.create('ErrorTopicAnswerCardPage',{
      tx:this.tx,
      topic:this.items,
      answer_key:this.answer_key
    })
    answerCard.onWillDismiss(data=>{
      if(data){
        if(data.currPage >= 0){
          this.slides.slideTo(data.currPage);
        }

        if(data.submit){
          this.submitExercise();
        }
      }

    });
    answerCard.present();
  }

  //交卷
  submitExercise(){
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
          paramsMap['answer_result_'+(index+1)] = data['answer_result_'+thiss.items[index]['ID']] || '';
        }
        paramsMap['topicCount'] = thiss.items.length;
        paramsMap['exsa001'] = thiss.exsa001;
      }
      this.errorTopicService.submitErrorTopic(paramsMap).subscribe(data1=>{
        if(Utils.isNotEmpty(data1.data))
          this.nativeService.alert('','',data1.data,()=>{
            this.storage.remove(this.answer_key);
            this.navCtrl.goToRoot({animate:true,direction:'back'});
            /*this.navCtrl.push('HomePage');
            let viewIndex = this.navCtrl.indexOf(this.viewCtrl);
            this.navCtrl.remove(viewIndex);
            this.navCtrl.remove(viewIndex-1);*/
          })
      },error=>{
        this.nativeService.hideLoading();
      });
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
  //离开页面处理数据
  ionViewCanLeave(){
    if(this.slides){
      let currPage = this.slides.activeIndex;
      this.storage.get(this.answer_key).then(data=>{
        if(data){
          data.currPage = currPage;
          this.storage.set(this.answer_key,data);
        }
      });
      this.slides.destroy(true,true);
    }
    this.moonClass = false;
  }

  //移除当前错题
  removeErrorTopic(){
    if(this.items.length <=0){
      return ;
    }

    let item = this.items[this.slides.activeIndex];
    //错题id
    let erto001 = item['ERTO001'];
    this.items = this.items.filter(t => t !== item);
    this.deleteErrorTopicCache(item['ID']);
    this.resetPage();
    let exsa001 = ""; //抽题id
    if(this.pageination.allPage <= 0){
      exsa001 = this.exsa001;
    }
    this.errorTopicService.delErrorTopic({erto001:erto001,exsa001:exsa001}).subscribe(data=>{
      if(this.pageination.allPage <= 0){
        this.navCtrl.push('ErrorTopicListPage');
        let viewIndex = this.navCtrl.indexOf(this.viewCtrl);
        this.navCtrl.remove(viewIndex);
        this.navCtrl.remove(viewIndex-1);
      }
    });

  }

  //将删除的错题缓存清除
  deleteErrorTopicCache(ID){
    this.storage.get(this.answer_key).then(data=>{
      if(data){
        delete data['topicId_'+ID];
        delete data['answer_result_'+ID];
        this.initAnswerNum(data);
        this.storage.set(this.answer_key,data);

      }
    });
  }

  //重置页码
  resetPage(){
    this.pageination.allPage = this.items.length;
    if(this.slides.activeIndex >= this.pageination.allPage)
      this.pageination.currPage = this.pageination.allPage;
    else
      this.pageination.currPage = this.slides.activeIndex+1;
  }
}
