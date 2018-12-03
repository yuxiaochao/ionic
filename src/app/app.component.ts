import { Component,ViewChild } from '@angular/core';
import {Platform, Nav, ToastController, ModalController, Tabs, App} from 'ionic-angular';
import { NativeService } from "../providers/NativeService";
import { Helper } from "../providers/Helper";
import { Storage } from "@ionic/storage";

import {GlobalData} from "../providers/GlobalData";
import {CommonService} from "../service/CommonService";
import { UserInfo } from "../model/UserInfo";
import {BackButtonProvider} from "../providers/BackButtonProvider";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('myNav') nav: Nav;
  @ViewChild('ion_tabs') tabRef: Tabs;

  rootPage:any = 'TabsPage';
  showHome:boolean = false;
  backButtonPressed: boolean = false;
  constructor(private platform: Platform,
              private nativeService : NativeService,
              private toastCtrl: ToastController,
              private helper : Helper,
              private storage: Storage,
              private globalData : GlobalData,
              private commonService : CommonService,
              public backButtonService: BackButtonProvider,
              private app: App,
              private modalCtrl: ModalController) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.nativeService.statusBarStyle();
      this.nativeService.splashScreenHide();
      this.backButtonService.registerBackButtonAction(this.tabRef);//重新后退操作，退到后台而不是退出应用
      this.nativeService.listenBackgroundMode();//监听程序是在前台还是在后台运行
      this.assertNetwork(); //检测网络
      this.helper.funDebugInit();//初始化fundebug
      this.helper.alloyLeverInit();//本地"开发者工具"
      this.storage.get('username').then(username=>{
        this.globalData.username = username;
      });
      this.storage.get('token').then(
        token => { //从缓存中获取token
        if (token) {
          this.globalData.token = token;
          this.commonService.getNewToken().mergeMap((data) => { //用旧token获取新token,旧token作为请求头
            this.globalData.token = data.newToken;
            this.storage.set('token', data.newToken);
            return this.commonService.getUserInfo();
          }).subscribe((userInfo:UserInfo) => {
            this.helper.loginSuccessHandle(userInfo);
            this.showHome = true;
          });
        } else {
          this.rootPage = 'LoginPage';
          this.showHome = true;

          /*let loginModal = this.modalCtrl.create('LoginPage',{});
          loginModal.onWillDismiss(data=>{
            this.showHome=data.showHome;
          });
          loginModal.present();*/
        }
      });
      this.outOfLine();//掉线后执行的操作
    });
  }

  assertNetwork() {
    if (!this.nativeService.isConnecting()) {
      this.toastCtrl.create({
        message: '未检测到网络,请连接网络',
        showCloseButton: true,
        closeButtonText: '确定'
      }).present();
    }
  }

  /**
   * 掉线了
   */
  outOfLine(){
    this.helper.outOfLine(()=>{
      //this.showHome = false;
      // this.nav.goToRoot({animate:true,direction:'back'}).then(()=>{
      //   let loginModal = this.modalCtrl.create('LoginPage',{});
      //   loginModal.onWillDismiss(data=>{
      //     this.showHome=data.showHome;
      //   });
      //   loginModal.present();
      // });
      this.storage.remove("token");
      this.nav.popToRoot();
      this.app.getRootNav().setRoot('LoginPage');
    });
  }



}
