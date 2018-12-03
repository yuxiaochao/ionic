import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';

import {Camera} from "ionic-native";
import {NativeService} from "../../../../../providers/NativeService";
import {CommonService} from "../../../../../service/CommonService";
import {UploadFileService} from "../../../../../providers/UploadFileService";
import {GlobalData} from "../../../../../providers/GlobalData";
import {Observable} from "rxjs";
import {Utils} from "../../../../../providers/Utils";


/**
 * Generated class for the TasksignPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-classPhotoUplode',
  templateUrl: 'classPhotoUplode.html',
})
export class ClassPhotoUplodePage {

  calt001: string;
  zb: string;
  address: string;
  imageDataitem: any = [];


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
    this.calt001 = this.navParams.get("CALT001");
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
    }
    let mtsi001 = Utils.uuid();
    let params: any = [];
    params['SIPI002'] = mtsi001;
    params['USER001']=this.globalData.userId;
    this.commonService.getPage('/huarui/hrswTMeetingtasksignin/addTaskSignIn',
      {
        MTSI001: mtsi001,
        MTSI002: this.calt001,
        MTSI003: 2,
        MTSI006: this.address,
        MTSI007: this.zb
      }).subscribe(data => {
      debugger;
      if (data.flag) {
        console.log('filePath--------' + this.imageDataitem);
        //上传图片
        this.uploadFileService.uploadFile({
          url: "/huarui/hrswTMeetingtasksignin/addPhoto",
          filePath: this.imageDataitem,
          fileParam: params
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
