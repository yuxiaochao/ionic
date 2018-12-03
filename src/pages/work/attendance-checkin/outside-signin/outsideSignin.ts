import {Component} from '@angular/core';
import {IonicPage, LoadingController, Navbar, NavController, NavParams} from 'ionic-angular';
import {Camera} from "ionic-native";
import {NativeService} from "../../../../providers/NativeService";
import {CommonService} from "../../../../service/CommonService";
import {UploadFileService} from "../../../../providers/UploadFileService";
import {GlobalData} from "../../../../providers/GlobalData";
import {Utils} from "../../../../providers/Utils";

@IonicPage()
@Component({
  selector: 'page-outsideSignin',
  templateUrl: 'outsideSignin.html',
})
export class OutsideSigninPage {
  mtsi002: string;//出勤计划ID
  mtsi003: string;
  mtsi006: string;
  mtsi007: string;
  mtsi008: number;
  mtsi009: number;
  mtsi010: string;
  title:string;
  imageDataitem: any = [];
  typeTitle:string='外出打卡';
  callback:any;
  // 调用相机时传入的参数
  private cameraOpt = {
    quality: 20,
    destinationType: Camera.DestinationType.FILE_URI, // Camera.DestinationType.FILE_URI,
    sourceType: 1, // Camera.PictureSourceType.CAMERA,
    encodingType: 0, // Camera.EncodingType.JPEG,
    mediaType: 0, // Camera.MediaType.PICTURE,
    allowEdit: false,
    correctOrientation: true
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public nativeService: NativeService,
              public commonService: CommonService,
              public uploadFileService: UploadFileService,
              public globalData: GlobalData,
              public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.callback = this.navParams.get('callback');
    this.typeTitle = this.navParams.get('typeTitle');//title
    this.mtsi002 = this.navParams.get("MTSI002");//出勤计划ID
    this.mtsi003 = this.navParams.get("MTSI003");//0.上班签到  1.下班签到
    this.mtsi006 = this.navParams.get("MTSI006");//	签到地址
    this.mtsi007 = this.navParams.get("MTSI007");//签到经纬度
    this.mtsi008 = this.navParams.get("MTSI008");//0.正常 1.早到 2.迟到 3.早退 4.加班
    this.mtsi009 = this.navParams.get("MTSI009");//早到、迟到、早退或加班等时长（分钟）
    this.title = this.navParams.get("TITLE");//早到、迟到、早退或加班等时长（分钟）
  }

  //离开页面事件
  ionViewWillLeave(){
    this.callback().then(()=>{});
  }

  //点击删除照片
  deleteImg(param) {
    this.imageDataitem.remove(param);
  }

  //打开相机
  openCamera(obj) {
    this.startCamera(obj).then(r => {
      //console.log('1111111111');
    });
  }

  //启动拍照功能
  private startCamera(obj) {
    return new Promise((resolve, reject) => {
      Camera.getPicture(this.cameraOpt).then((imageData) => {
        console.log(imageData);
        this.imageDataitem.push(imageData);
      }, (err) => {
        //this.noticeSer.showToast('ERROR:' + err); //错误：无法使用拍照功能！
        reject("startCamera02 err:" + JSON.stringify(err));
      });
    });
  }

  toSubmit() {
    if (this.imageDataitem.length == 0) {
      return this.nativeService.alert("请拍照后提交!");
    }else if(this.mtsi010==undefined||this.mtsi010==''||this.mtsi010==null){
      return this.nativeService.alert("请填写证明!");
    }
    let mtsi001 = Utils.uuid();
    let params: any = [];
    params['SIPI002'] = mtsi001;
    params['USER001']=this.globalData.userId;

    this.commonService.getPage('/huarui/hrswTMeetingtasksignin/signIn',
      {
        MTSI001: mtsi001,
        MTSI002: this.mtsi002,
        MTSI003: this.mtsi003,
        MTSI006: this.mtsi006,
        MTSI007: this.mtsi007,
        MTSI008: this.mtsi008,
        MTSI009: this.mtsi009,
        MTSI010: this.mtsi010,
        MTSI011: 2,
      }).subscribe(data => {
      debugger
      if (data.flage) {
        console.log('filePath--------' + this.imageDataitem);
        this.nativeService.alert(this.title);
        //上传图片
        this.uploadFileService.uploadFile({
          url: "/huarui/hrswTMeetingtasksignin/addPhoto",
          filePath: this.imageDataitem,
          fileParam: params,
        }).then((data) => {
          setTimeout(2000);
          this.navCtrl.pop();
        }).catch(e => {
          console.log(e);
        });
      }
    });
  }

}
