import { AppMinimize } from '@ionic-native/app-minimize';
import {App, NavController, Platform, Tabs, ToastController} from "ionic-angular";
import {Injectable} from "@angular/core";
@Injectable()
export class BackButtonProvider {

  //控制硬件返回按钮是否触发，默认false
  backButtonPressed: boolean = false;

  //构造函数 依赖注入
  constructor(public platform: Platform,
              public appCtrl: App,
              public toastCtrl: ToastController, private appMinimize: AppMinimize) { }

  //注册方法
  registerBackButtonAction(tabRef: Tabs): void {

    //registerBackButtonAction是系统自带的方法
    this.platform.registerBackButtonAction(() => {
      //获取NavController
      let activeNav: NavController = this.appCtrl.getActiveNavs()[0];
      //如果可以返回上一页，则执行pop
      if (activeNav.canGoBack()) {
        activeNav.pop();
      } else {
        if (tabRef == null || tabRef._selectHistory[tabRef._selectHistory.length - 1] === tabRef.getByIndex(0).id) {
          //执行退出
          this.appMinimize.minimize();
        } else {
          //选择首页第一个的标签
          tabRef.select(0);
        }
      }
    });
  }

}
