import {Component, ViewChild} from '@angular/core';
import {Content, InfiniteScroll, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../service/CommonService";
import {EasemobChatService} from "../../../providers/EasemobChatService";

/**
 * Generated class for the SystemnewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-systemnews',
  templateUrl: 'systemnews.html',
})
export class SystemnewsPage {

  items:any = [];
  box_hd_isShow: boolean = false;//是否显示“没有更多信息了”
  isInfiniteScroll:boolean = false;
  start : number = 1;
  wuneirong:boolean = false;

  @ViewChild(Content) content: Content;
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  constructor(public navCtrl: NavController,
              public commonService : CommonService,
              private eoChatService:EasemobChatService,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SystemnewsPage');
    this.initDate();
    this.eoChatService.setShowUnread(()=>{
      this.showUnread();
    });
  }

  ionViewWillLeave() {// 离开当前页面 执行的事件
    this.eoChatService.unsetShowUnread();
  }

  initDate(){
    this.commonService.getPage("/cts/systemMessagesList").subscribe(data=>{
      if (data.systemMessagesList && data.systemMessagesList.length >= 1) {
        let list = data.systemMessagesList;
        for(let i=0;i<list.length;i++){
          let item = list[i];
          this.items.unshift(item);//往头部添加元素
        }
        setTimeout(()=>{
          this.content.scrollToBottom(0).then(req=>{
            if(this.items.length >= 20){
              this.isInfiniteScroll = true;//加载更多块
              this.infiniteScroll.enable(true);
            }
          });//滑到页面最底部
        },0)
      }else{
        this.wuneirong = true;
      }
    });
  }

  /**
   * 有新消息调用该方法
   */
  showUnread(){
    this.items = [];
    this.initDate();
  }

  //向上滑动加载更多历史信息
  doInfinite(infiniteScroll) {
    console.log("infiniteScroll");
    this.commonService.getPage("/cts/systemMessagesList",{START:++this.start}).subscribe(data => {
      if (data.systemMessagesList && data.systemMessagesList.length >= 1) {
        let list = data.systemMessagesList;
        for(let i=0;i<list.length;i++){
          let item = list[i];
          this.items.unshift(item);//往头部添加元素
        }
      }else {
        this.box_hd_isShow = true;//没有更多数据了
        this.isInfiniteScroll = false;//加载更多块
        infiniteScroll.enable(false);
      }


      infiniteScroll.complete();
    });
  }

  /**
   * 点击查看
   */
  clickCheck(obj){
    //1.任务 2.日程 3.会议 4.评价 5.待我确认 6.纪实 7.出勤 8.任务签到 9.会议签到
    let type = obj["CHME009"];
    if(type == "0"){
      //this.navCtrl.push("WeektaskPage" );//系统帮助
    }else if(type == "1"){
      this.navCtrl.pop().then(()=>{
        this.navCtrl.push("WeektaskPage" );//本周任务
      });
      this.navCtrl.parent.select(2);//第三个tab页
    }else if(type == "2"){
      this.navCtrl.pop();
      this.navCtrl.parent.select(1);//第二个tab页
    }else if(type == "3"){
      this.navCtrl.pop().then(()=>{
        this.navCtrl.push("WeekmeetingPage" );//本周会议
      });
      this.navCtrl.parent.select(2);//第三个tab页
    }else if(type == "4"){
      this.navCtrl.pop().then(()=>{
        this.navCtrl.push("TaskevaluationPage" );//评价
      });
      this.navCtrl.parent.select(2);//第三个tab页
    }else if(type == "5"){
      this.navCtrl.pop().then(()=>{
        this.navCtrl.push("WaitconfirmPage" );//待我确认
      });
      this.navCtrl.parent.select(2);//第三个tab页
    }else if(type == "6"){
      this.navCtrl.pop().then(()=>{
        this.navCtrl.push("DutydocPage" );//履职纪实
      });
      this.navCtrl.parent.select(2);//第三个tab页
    }else if(type == "7"){
      this.navCtrl.pop().then(()=>{
        this.navCtrl.push("AttendanceCheckinPage" );//出勤签到
      });
      this.navCtrl.parent.select(2);//第三个tab页
    }else if(type == "8"){
      this.navCtrl.pop().then(()=>{
        this.navCtrl.push("TasklistPage" );//任务签到
      });
      this.navCtrl.parent.select(2);//第三个tab页
    }else if(type == "9"){
      this.navCtrl.pop().then(()=>{
        this.navCtrl.push("ConferencelistPage" );//会议签到
      });
      this.navCtrl.parent.select(2);//第三个tab页
    }
  }

}
