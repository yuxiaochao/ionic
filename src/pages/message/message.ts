import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {EasemobChatService} from "../../providers/EasemobChatService";
import {NativeService} from "../../providers/NativeService";
import {FriendSearchersPage} from "../contact/friend-searchers/friend-searchers";
import {SystemnewsPage} from "./systemnews/systemnews";
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {CommonService} from "../../service/CommonService";
import {Utils} from "../../providers/Utils";

/**
 * Generated class for the MessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {

  data: Array<any> = [];
  scanSub: any;
  light: boolean;//判断闪光灯
  frontCamera: boolean;//判断摄像头
  isShow: boolean = false;//控制显示背景，避免切换页面卡顿
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private eoChatService: EasemobChatService,
              //private alertCtrl: AlertController,
              private nativeService: NativeService,
              private qrScanner: QRScanner,
              public commonService: CommonService,) {
    this.light = false;
    this.frontCamera = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
    this.initData();
    this.eoChatService.setShowUnread(() => {
      this.showUnread();
    });
    this.eoChatService.setInitializationSuccess(() => {//初始化完成调用该方法
      this.initData();
    });
  }

  ionViewDidEnter() {//每进一次页面执行一次
    this.initData();
  }

  ionViewWillLeave() {// 离开当前页面 执行的事件
    this.eoChatService.unsetShowUnread();
    this.hideCamera();
  }

  initData() {
    let mobile = this.nativeService.getMobile();//判断是什么客户端   android     ios
    let isMobile = this.nativeService.isMobile();//判断是否真机
    if ((mobile == "android" || mobile == "ios") && isMobile) {//判断是否真机
      this.data = this.eoChatService.readUserChatProfile();
    } else {
      this.data = [{
        portrait: 'system',
        fromName: '系统消息',
        msg: '您有新的消息',
        sendingDate: '09-18 09:12',
        unreadNum: '16',
        type: 'system'
      },
        {
          portrait: 'newFriend',
          fromName: '新的好友',
          msg: '您有新的好友申请',
          sendingDate: '15:30',
          unreadNum: '3',
          type: 'newFriend'
        },
        {
          portrait: 'dangjianban',
          fromName: '党建办',
          msg: '任务上报了',
          sendingDate: '09-18 09:12',
          unreadNum: '7',
          type: 'dangjianban'
        }];
    }
  }

  /**
   * 有新消息调用该方法
   */
  showUnread() {
    this.initData();
  }

  //点击联系人
  clickContacts(obj) {

    if (obj && obj.type == "system") {//跳转系统信息
      this.navCtrl.push('SystemnewsPage', {});
      /****************** 把該對象未讀信息設置為0 *****************/
      this.eoChatService.readMessageNum(obj.from, obj.fromType).then(() => {
      });
    } else if (obj && obj.type == "newFriend") {//跳转到新的好友申请
      this.navCtrl.push('ContactSearchersPage');
      /****************** 把該對象未讀信息設置為0 *****************/
      this.eoChatService.readMessageNum(obj.from, obj.fromType).then(() => {
      });
    } else if (obj && obj.type == "dangjianban") {//跳转到党建办

    } else {
      this.navCtrl.push("ChatMessagePage", {thisUserId: obj.from});
    }

  }

//滑动已讀
  swipeItem01(obj) {
    console.log("swipeItem01()");
    this.eoChatService.readMessageNum(obj.from, obj.fromType).then(() => {
      this.initData();//刷新列表
    });
  }

  //点击置顶
  clickItem01(obj) {
    console.log("clickItem01('点击置顶')");
    this.eoChatService.setTop(obj.from, obj.fromType).then(() => {
      this.initData();//刷新列表
    });
  }

  //点击删除
  clickItem02(obj) {
    console.log("clickItem02()");
    this.eoChatService.removeUserChatProfile(obj.from, obj.fromType).then(() => {
      this.initData();//刷新列表
    });
  }

  /**
   * 点击搜索框
   */
  clickSearch() {
    //FLAG  = 1  查询我的好友     = 2 查询所有用户   = 3  查询我的群组   = 4 查询我的好友和群组  = 5 查询所有用户和群组
    this.navCtrl.push("FriendSearchersPage", {FLAG: 4});
  }

  //扫码
  initQRCode() {
    //this.navCtrl.push('TwocodeGoQrdcanPage');
    //可以提前请求权限
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
      if (status.authorized) {
        //授予了相机许可权
        //开始扫描
        this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
          console.log('Scanned something', text);
          debugger
          let ptext: any = JSON.parse(text);
          if (ptext.type == 0) {//二维码会议签到
            let meetingInfo: any = [];
            this.commonService.getPage('/huarui/hrswTCalendarmemorandum/meetingInfo',
              {meet001: ptext.value}).subscribe(data => {
              if (data.meetingInfo[0]) {
                meetingInfo = data.meetingInfo[0];
                if (ptext.value || meetingInfo) {
                  this.commonService.getPage('/huarui/hrswTCalendarmemorandum/getMeetingSigninUser',
                    {meet001: ptext.value}).subscribe(data => {
                      if(data.flag==0){
                        this.nativeService.alert("当前用户不是会议成员！");
                      }else if(data.flag==1) {
                        this.nativeService.alert("当前用户已经签到");
                      }else if(data.flag==2){
                        this.toSubmit(ptext.value);
                      }
                  });
                } else {
                  this.nativeService.alert("当前会议不存在！请重新扫描");
                }
              }
            });
          } else if (ptext.type == 1) {//二维码添加好友
            this.commonService.getPage('/mine/userInfoMultiple',
              {option: [ptext.value]}).subscribe(data => {
              if (data.userInfoMultiple.length > 0) {
                let obj = data.userInfoMultiple[0];
                this.navCtrl.push('ApplyForFriendsPage', {ITEM: obj});
              } else {
                this.nativeService.alert("无当前用户！");
              }
            });
          }
          this.scanSub.unsubscribe();
          this.isShow = false;
          this.hideCamera();
        });
        this.qrScanner.show();
      } else if (status.denied) {
        //相机许可被永久拒绝
        //必须使用QRScanner.openSettings（）方法引导用户进入设置页面
        //然后他们可以从那里授予许可
        this.qrScanner.openSettings();
      } else {
        //权限被拒绝，但不是永久性的。您可以稍后再次申请许可。
        this.nativeService.alert("扫描二维码权限被拒绝，但不是永久性的。您可以稍后再次申请许可！");
      }
    }).catch((e: any) => console.log('Error is', e));
  }

  toSubmit(text) {
    let mtsi001 = Utils.uuid();
    this.commonService.getPage('/huarui/hrswTMeetingtasksignin/addTaskSignIn',
      {
        MTSI001: mtsi001,
        MTSI002: text,
        MTSI003: 1,
      }).subscribe(data => {
      if (data.flag) {
        this.nativeService.alert("签到成功");
      }
    });
  }

  goQrdcan() {
    //页面可见时才执行
    this.initQRCode();
    this.showCamera();
    this.isShow = true;//显示背景
  }

  goToBack() {
    this.scanSub.unsubscribe();
    this.isShow = false;
    this.hideCamera();
  }

  //添加好友方法
  addFriends(){
    this.navCtrl.push('ContactSearchersPage');
  }

  togaode(){
    this.navCtrl.push('GaodeMapTestPage');
  }

  /**
   * 闪光灯控制，默认关闭
   */
  toggleLight() {
    if (this.light) {
      this.qrScanner.disableLight();
    } else {
      this.qrScanner.enableLight();
    }
    this.light = !this.light;
  }

  /**
   * 前后摄像头互换
   */
  toggleCamera() {
    if (this.frontCamera) {
      this.qrScanner.useBackCamera();
    } else {
      this.qrScanner.useFrontCamera();
    }
    this.frontCamera = !this.frontCamera;
  }

  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }

  hideCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
    this.qrScanner.hide();//需要关闭扫描，否则相机一直开着
    this.qrScanner.destroy();//关闭
  }

}
