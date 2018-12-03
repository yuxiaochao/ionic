import {Component, ElementRef, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {OnlineExamService} from "../../../../service/online-exam/OnlineExamService";
declare let Swiper: any;
@IonicPage()
@Component({
  selector: 'page-online-exam-answer-result',
  templateUrl: 'online-exam-answer-result.html',
})
export class OnlineExamAnswerResultPage {

  TACT001:string; //试卷id
  EGRA001:string; //成绩id
  paper:Object;
  tx:Array<string>;
  items : Array<string> = [];
  answerList: Array<string>;
  pageination = {currPage:1,allPage:0};
  slides:any;
  @ViewChild(Content) content: Content;
  @ViewChild('containerContent', { read: ElementRef }) containerContent: ElementRef;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public onlineExamService:OnlineExamService) {

  }

  ionViewDidLoad() {
    this.TACT001 = this.navParams.get("TACT001");
    this.EGRA001 = this.navParams.get("EGRA001");
    this.onlineExamService.viewPaper({TACT001:this.TACT001,EGRA001:this.EGRA001}).subscribe(data=>{
      this.initData(data);//初始化试卷信息
      this.initSwiper();//初始化swiper
    });

  }

  initData(data){
    this.paper = data.examPaper;
    this.tx = data.tx;
    if(this.paper['TACT027'] == 2){
      this.compareTopic(this.tx,data.topic);
    }else{
      this.items = data.topic;
    }
    this.pageination.allPage = this.items.length;
    this.answerList = data.answer;
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

  initSwiper(){
    let thiss = this;
    this.slides = new Swiper('.swiper-container',{
      observer:true,
      observeParents:true,
      roundLengths : true,
      navigation: {
        nextEl: '.button-next',
        prevEl: '.button-prev'
      },
      on:{
        transitionEnd() {
          if(this.activeIndex >= thiss.pageination.allPage){
            thiss.pageination.currPage = thiss.pageination.allPage;
          }else{
            thiss.pageination.currPage = this.activeIndex+1;
          }
          thiss.content.scrollToTop();
          thiss.containerContent.nativeElement.scrollTop = 0;
        }
      }
    })
  }

  //只加载3道试题
  showSilde(itemIndex){
    if(itemIndex-1 <= this.slides.activeIndex && this.slides.activeIndex <= itemIndex +1){
      return true;
    }
    return false;
  }
}
