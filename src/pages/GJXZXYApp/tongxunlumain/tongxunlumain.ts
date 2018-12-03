import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {MygroupclassPage} from "./mygroupclass/mygroupclass";
import {AddnewfriendsPage} from "./addnewfriends/addnewfriends";
import {HaoyouliaotianPage} from "./haoyouliaotian/haoyouliaotian";
import {GlobalData} from "../../../providers/GlobalData";
import {CommonService} from "../../../service/CommonService";
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {NativeService} from "../../../providers/NativeService";


@IonicPage()
@Component({
  selector: 'page-tongxunlumain',
  templateUrl: 'tongxunlumain.html',
})
export class TongxunlumainPage {

  /****************  页面变量 start ****************/
  alphaSidebar_top;
  alphaSidebarP_marginBottom;
  /****************  页面变量 end ****************/

  contactItems: any = [];
  toppings: number;
  j: number = 3;
  k: number = 5;

  scanSub: any;
  light: boolean;//判断闪光灯
  frontCamera: boolean;//判断摄像头
  isShow: boolean = false;//控制显示背景，避免切换页面卡顿

  @ViewChild('alpha_sidebar') alpha_sidebar: ElementRef;
  @ViewChild('headerEle', {read: ElementRef}) headerEle: ElementRef;
  @ViewChild('divList', {read: ElementRef}) divList: ElementRef;

  constructor(public navCtrl: NavController,
              public commonService: CommonService,
              public renderer: Renderer2,
              public globalData: GlobalData,
              private qrScanner: QRScanner,
              private nativeService: NativeService,) {
    this.light = false;
    this.frontCamera = false;

  }


  ionViewDidEnter() {
    console.log("ionViewDidEnter(2)");
    this.initData({});
  }

  //初始数据
  initData(params) {
    this.globalData.showLoading = false;
    this.requestDataList("/cts/queryFriendList", {LIMIT: 1000, CONT004: 1}).subscribe(data => {
      if (data.friendList && data.friendList.length >= 1) {
        let friendList = data.friendList;
        let currentLetter = "";//当前字母
        for (let i = 0; i < friendList.length; i++) {
          let friendnow = friendList[i];
          let nextFriend;
          if (friendList.length > i + 1) {
            nextFriend = friendList[i + 1];
          } else {
            nextFriend = null;
          }
          let headLetter = friendnow.USER023;
          if (currentLetter != headLetter) {//判断数据是否该字母头一条数据
            currentLetter = headLetter;
            friendnow.isFirstData = true;
          } else {
            currentLetter = headLetter;
            friendnow.isFirstData = false;
          }
          if (!nextFriend) {//判断数据是否该字母最后一条数据
            friendnow.isLastData = true;
          } else {
            //let nextHeadLetter = nextFriend.USER023;
            friendnow.isLastData = currentLetter != headLetter;
          }
        }
        this.contactItems = friendList;
      } else {
        this.contactItems = [];
      }
      if (params.callback) {
        params.callback();
      }//回调函数
    });
    this.globalData.showLoading = true;
  }

  //获取列表（默认加载10条）
  requestDataList(url: string, paramMap?) {
    return this.commonService.getPage(url, paramMap);
  }

  //添加好友方法
  addFriends() {
    this.navCtrl.push('ContactSearchersPage');
  }

  //班级讨论组
  classDiscussionGroup() {

  }

  //我的群聊
  myGroupChat() {
    this.navCtrl.push('ContactGroupSearchersPage');
  }

  //点击联系人
  clickContacts(obj) {
    this.navCtrl.push('HaoyouliaotianPage', {thisUserId: obj.USER001});
  }

  /**
   * 点击字母
   */
  gotoList(zimu) {
    let obj = this.divList.nativeElement.querySelector("#" + zimu);
    if (obj) {
      obj.scrollIntoView(true);
    }
  }

  /**
   * 点击搜索框
   */
  clickJiadesousuokuang() {
    //FLAG  = 1  查询我的好友     = 2 查询所有用户   = 3  查询我的群组   = 4 查询我的好友和群组  = 5 查询所有用户和群组
    this.navCtrl.push("FriendSearchersPage", {FLAG: 1});
    // this.navCtrl.push('ContactSearchersPage');
  }

  toChange() {
    this.j == 3 ? this.j = 4 : this.j = 3;
    this.k == 5 ? this.k = 6 : this.k = 5;
    if (this.toppings == 3 || this.toppings == 4) {//扫一扫
      this.goQrdcan();
    } else if (this.toppings == 5 || this.toppings == 6) {//添加好友
      this.navCtrl.push('ContactSearchersPage');
    }
  }


  mygroupClick() {
    this.navCtrl.push('MygroupclassPage');
  }

  newfriends() {//添加新的好友
    this.navCtrl.push('AddnewfriendsPage');
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

  goQrdcan() {
    //页面可见时才执行
    this.initQRCode();
    this.showCamera();
    this.isShow = true;//显示背景
  }

  goToBack() {
    //this.scanSub.unsubscribe();
    this.isShow = false;
    this.hideCamera();
  }

  togaode(){
    this.navCtrl.push('GaodeMapTestPage');
  }

  //闪光灯控制，默认关闭
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
