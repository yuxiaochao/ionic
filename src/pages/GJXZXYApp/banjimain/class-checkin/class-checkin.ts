import {Component} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams
} from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";
import {GlobalData} from "../../../../providers/GlobalData";
import {Utils} from "../../../../providers/Utils";
import {Observable} from "rxjs";
import {NativeService} from "../../../../providers/NativeService";


@IonicPage()
@Component({
  selector: 'page-class-checkin',
  templateUrl: 'class-checkin.html',
})
export class ClassCheckinPage {

  signinList: any = [];//当天的签到集合
  time: string;//当前时间是上午下午还是晚上
  timeNum: number;//1、上午 2、下午 3、晚上
  thisDate: any = new Date();
  actionSheet: any;//类型选择器

  /*----高德定位参数---*/
  zb: string;//经纬度字符串“，”隔开
  address: string;//定位地址
  longitude: any;//经度
  latitude: any;//纬度
  BLongitude: any;//基础经度
  BLatitude: any;//基础纬度
  accuracy: string;//范围

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService,
              public globalData: GlobalData,
              public alert: AlertController,
              public loadingCtrl: LoadingController,
              public nativeService: NativeService,
              public alertCtrl: AlertController,) {
  }

  ionViewDidLoad() {
    let thisTime = new Date().getHours();
    if (thisTime < 12) {
      this.time = '上午';
      this.timeNum = 1;
    } else if (thisTime < 19) {
      this.time = '下午';
      this.timeNum = 2;
    } else {
      this.time = '晚上';
      this.timeNum = 3;
    }
    this.initSigninList().subscribe(data => {
      if (data.initSigninList) {
        this.signinList = data.initSigninList;
      }
    });
  }

  //初始化今天的签到集合
  initSigninList(param?) {
    return this.commonService.getPage('/huarui/xzxyTTrainingcourse/initSigninList', param);
  }

  /**
   * 高德定位--获取当前坐标--签到前定位
   * @param item
   */
  initialization(item) {
    // let param = {TCS001: item.TCS001,CWAD010:this.timeNum};
    // let m:number = this.timeDifference(item.TRPC016);//计算迟到或早到了多长时间
    // if(m>0){//早到
    //   param['CWAD006'] = 1;
    // }else if(m==0) {//正常
    //   param['CWAD006'] = 1;
    // }else if(m<0){//迟到
    //   param['CWAD006'] = 2;
    // }
    // param['CWAD011'] = m.toFixed(0);
    // //测试签到时解开
    // this.commonService.getPage('/huarui/xzxyTTrainingcourse/toSignin', param).subscribe(data => {
    //   if (data.flag) {
    //     this.nativeService.alert("签到成功");
    //     this.ionViewDidLoad();
    //   } else {
    //     this.nativeService.alert("签到失败");
    //   }
    // });

    //正式打包时解开
    let loading = this.loadingCtrl.create({
      content: '等待定位...'//设置loading时显示的文字
    });
    loading.present();
    Observable.zip(this.nativeService.assertLocationService(), this.nativeService.assertLocationAuthorization()).subscribe(() => {
      GaoDe.getCurrentPosition((r) => {
        loading.dismiss();
        let latitude = r["latitude"];//纬度
        let longitude = r["longitude"];//经度
        //判断是否成功定位
        if (latitude != undefined) {
          this.zb = longitude + "," + latitude;
          this.longitude = longitude;
          this.latitude = latitude;
          this.address = r["address"];

        } else {
          return this.nativeService.alert("当前定位失败！请稍后重试");
        }
        //签到
        this.normalSignIn(item);
      }, (e) => {
        console.log('Location err:' + e);
        return this.nativeService.alert("定位失败！请稍后重试");
      });
    }, () => {
      loading.dismiss();
      return this.nativeService.alert("初始化定位失败！请稍后重试");
    });
  }


  /**
   * @param item 签到信息
   * @constructor
   */
  normalSignIn(item) {
    //TODO 调用接口获取PC端配置的机构基础定位坐标、精确度
    let accuracy = item.LOCATIONFW;//10米
    //基础点坐标
    let baseLongitude_latitude: string = item.LOCATIONZB;//教室坐标
    if (!item.LOCATIONZB) {
      return this.nativeService.alert("教室坐标为空！");
    }
    console.log(baseLongitude_latitude);
    let position = baseLongitude_latitude.split(',');
    //获取两点之间的差值
    let difference = Utils.getDistance(this.latitude, this.longitude, position[1], position[0]);//差值
    if (parseFloat(difference) >= accuracy) {
      this.BLongitude = position[0];
      this.BLatitude = position[1];
      this.accuracy = accuracy;
      let alert = this.alertCtrl.create({
        message: '您当前的位置不在打卡范围内是否打开地图查看器？',
        buttons: [
          {
            text: '取消',
            handler: () => {
            }
          },
          {
            text: '确定',
            handler: () => {
              this.navCtrl.push('GaodeMapTestPage', {
                BLongitude: this.BLongitude,
                BLatitude: this.BLatitude,
                Longitude: this.longitude,
                Latitude: this.latitude,
                Accuracy: parseFloat(this.accuracy)
              });
            }
          }
        ]
      });
      alert.present();
    } else {
      //调用签到接口
      let param = {TCS001: item.TCS001, CWAD010: this.timeNum};
      let m: number = this.timeDifference(item.TRPC016);//计算迟到或早到了多长时间
      if (m > 0) {//早到
        param['CWAD006'] = 1;
      } else if (m == 0) {//正常
        param['CWAD006'] = 1;
      } else if (m < 0) {//迟到
        param['CWAD006'] = 2;
      }
      param['CWAD011'] = m.toFixed(0);
      //测试签到时解开
      this.commonService.getPage('/huarui/xzxyTTrainingcourse/toSignin', param).subscribe(data => {
        if (data.flag) {
          this.nativeService.alert("签到成功");
          this.ionViewDidLoad();
        } else {
          this.nativeService.alert("签到失败");
        }
      });
    }
  }

  //计算时长
  timeDifference(bTime) {
    let date: Date = new Date();
    console.log(bTime);
    let splitDate = bTime.split(':');
    date.setHours(parseInt(splitDate[0]));
    date.setMinutes(parseInt(splitDate[1]));
    let time: number = new Date().getTime();
    //计算出小时数
    return (date.getTime() - time) / (60 * 1000);
  }


}
