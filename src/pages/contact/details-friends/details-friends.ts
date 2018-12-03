import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../service/CommonService";
import {GlobalData} from "../../../providers/GlobalData";

/**
 * Generated class for the DetailsFriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details-friends',
  templateUrl: 'details-friends.html',
})
export class DetailsFriendsPage {

  thisUserId:string;//这个用户的id
  friendInfo:any = {};//用户基本信息

  @ViewChild('div0102',{read:ElementRef}) div0102:ElementRef;//头像img
  @ViewChild('div0104',{read:ElementRef}) div0104:ElementRef;//背景img
  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController, public navParams: NavParams,public commonService : CommonService, public renderer: Renderer2,public globalData : GlobalData) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsFriendsPage');
    this.thisUserId = this.navParams.get("USER001");
    this.initPage();
    //初始化数据
    this.initData();
  }
  //初始化页面布局
  initPage(){
    // let windowWidth = this.content.contentWidth;  //获得的是0 ？？？
    // let windowHeight = this.content.contentHeight;//获得的是0 ？？？

    let bgWidth = this.div0104.nativeElement.offsetWidth;
    let bgHeight = this.div0104.nativeElement.offsetHeight;

    let headWidth = this.div0102.nativeElement.offsetWidth;
    let headHeight = this.div0102.nativeElement.offsetHeight;
    this.renderer.setStyle(this.div0102.nativeElement,"left",(bgWidth/2 - headWidth/2) + "px");
    this.renderer.setStyle(this.div0102.nativeElement,"top",(bgHeight - headHeight/2) + "px");
  }
//返回
  callback(){
    this.navCtrl.pop();
  }
//发消息
  sendMessage(){
    this.navCtrl.push("ChatMessagePage",{thisUserId:this.thisUserId});
  }

  //获取列表（默认加载10条）
  requestDataList(url:string,paramMap?){
    return this.commonService.getPage(url,paramMap);
  }

  //初始数据
  initData(params?) {
    this.requestDataList("/cts/queryFriendInfo", {FRIENDID:this.thisUserId}).subscribe(data => {
      if (data.friendInfo) {
        this.friendInfo = data.friendInfo;
        this.friendInfo.isOneself = data.friendInfo["USER001"] == this.globalData.userId ? 1 : 0;//判断是否自己
        this.friendInfo.ismyfriend = data.ismyfriend;//是否好友
      }
      if(params && params.callback){params.callback();}//回调函数
    });
  }
//点赞
  clickGood(){
    this.globalData.showLoading = false;
    this.friendInfo.PRAISE = this.friendInfo.PRAISE - (this.friendInfo.FRRS005 == "0"?-1:1);
    this.friendInfo.FRRS005 = Math.abs(parseInt(this.friendInfo.FRRS005) - 1).toString();
    this.commonService.getPage("/cts/thumbsUp",{FRRS005:this.friendInfo.FRRS005,FRIENDID:this.thisUserId}).subscribe(()=>{
    });
    this.globalData.showLoading = true;
  }
//添加好友按钮
  addFriendButton(obj){
    this.navCtrl.push('ApplyForFriendsPage',{ITEM:obj});
  }
}
