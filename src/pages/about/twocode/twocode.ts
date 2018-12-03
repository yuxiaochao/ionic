import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalData} from "../../../providers/GlobalData";
import {CommonService} from "../../../service/CommonService";
//import {TwocodeGoQrdcanPage} from "./twocode-go-qrdcan/twocode-go-qrdcan";
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner';
import {Buffer} from 'buffer';


/**
 * Generated class for the TwocodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-twocode',
  templateUrl: 'twocode.html',
})
export class TwocodePage {

  USER001: String;

  /* public  scannedText: string;*/
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public globalData: GlobalData,
              public commonService: CommonService,
              private qrScanner: QRScanner) {
  }

  ionViewDidLoad() {
    let Str = this.globalData.userId;
    //base64编码
    this.USER001 = new Buffer(Str).toString('base64');
  }

  //扫码
  goQrdcan() {
    //this.navCtrl.push('TwocodeGoQrdcanPage');
    //可以提前请求权限
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
      if (status.authorized) {
        //授予了相机许可权
        //开始扫描
        let scanSub = this.qrScanner.scan().subscribe((text: string) => {
          console.log('Scanned something', text);
          this.qrScanner.show(); //显示相机预览
          setTimeout(3000);
          this.qrScanner.hide(); //隐藏相机预览
          scanSub.unsubscribe(); //停止扫描
        });

      } else if (status.denied) {
        //QRScanner.openSettings();
        //相机许可被永久拒绝
        //必须使用QRScanner.openSettings（）方法引导用户进入设置页面
        //然后他们可以从那里授予许可
      } else {
        //权限被拒绝，但不是永久性的。您可以稍后再次申请许可。
      }
    }).catch((e: any) => console.log('Error is', e));

  }


}



