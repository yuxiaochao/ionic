import {Component, ViewChild} from '@angular/core';
import {
  AlertController, Content, InfiniteScroll, IonicPage, LoadingController, NavController,
  NavParams
} from 'ionic-angular';
import {ErrorTopicService} from "../../../../service/error-topic/ErrorTopicService";
import {GlobalData} from "../../../../providers/GlobalData";

@IonicPage()
@Component({
  selector: 'page-error-topic-list',
  templateUrl: 'error-topic-list.html',
})
export class ErrorTopicListPage {

  items : any = [];
  start : number = 1;
  totalNum:number = 0; //错题总数
  randomTopicNum:number; //随机错题数量
  @ViewChild(Content) content: Content;
  @ViewChild(InfiniteScroll) infiniteScroll :InfiniteScroll;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public errorTopicService:ErrorTopicService,
              public globalData:GlobalData,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.initData();
  }

  //初始化错题列表
  initData(){
    this.content.scrollToTop(0);
    this.infiniteScroll.enable(true);
    this.errorTopicService.getErrorTopicList().subscribe(data=>{
      if(data){
        this.items = data.errorTopicList;
        if(this.items.length <= 10){
          this.infiniteScroll.enable(false);
        }
        this.totalNum = data.totalNum;
      }
    });
  }

  //滚动更多数据
  doInfinite(infiniteScroll) {
    this.globalData.showLoading = false;
    this.errorTopicService.getErrorTopicList({START:++this.start})
      .auditTime(500)
      .subscribe(data=>{
        if(data.errorTopicList.length > 0){
          this.items = this.items.concat(data.errorTopicList);
        }else{
          infiniteScroll.enable(false);
        }
        infiniteScroll.complete();

      })
    setTimeout(() => {
      this.globalData.showLoading = true;
    }, 50);
  }

  //进入错题
  intoErrorTopic(item?){
    //验证是否有未完成的随机错题
    let topi003 = "";//知识点
    if(item){
      topi003 = item.TOPI003;
    }else{
      if(this.totalNum === 0)
        return;
    }
    this.errorTopicService.checkRandomErrorTopic({topi003:topi003}).subscribe(data=>{
      let sampleMap = data.sampleMap || {};
      if(sampleMap.EXSA001){
        this.promptLastTimeError(topi003,sampleMap.EXSA001);
      }else{
        this.initTopicPrompt(topi003);
      }
    });
  }

  //提示继续上次练习
  promptLastTimeError(topi003,exsa001){
    let confirm = this.alertCtrl.create({
      title: '您上次错题练习未提交',
      message: '',
      buttons: [
        {
          text: '我要重新抽题',
          handler: () => {
           this.initTopicPrompt(topi003);
          }
        },
        {
          text: '继续上次错题练习',
          handler: () => {
            this.navCtrl.push('ErrorTopicTestPage',{topi003:topi003,exsa001:exsa001});
          }
        }
      ]
    });
    confirm.present();
  }

  initTopicPrompt(topi003){
    let alert = this.alertCtrl.create();
    alert.setTitle('随机抽取');

    alert.addInput({
      type: 'radio',
      label: '15道题',
      value: '15',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: '30道题',
      value: '30'
    });

    alert.addInput({
      type: 'radio',
      label: '60道题',
      value: '60'
    });

    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        this.randomTopicNum = data;
        this.questionErrorTopic(topi003);
      }
    });
    alert.present();
  }

  //抽题
  questionErrorTopic(topi003){
    this.navCtrl.push('ErrorTopicTestPage',{topi003:topi003,randomTopicNum:this.randomTopicNum});
  }
}
