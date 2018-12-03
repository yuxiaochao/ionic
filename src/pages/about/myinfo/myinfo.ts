import { Component } from '@angular/core';
import {ActionSheetController, AlertController, IonicPage, NavController, NavParams,App} from 'ionic-angular';
import {CommonService} from "../../../service/CommonService";
import { Camera,CameraOptions }  from '@ionic-native/camera';
//import { Injectable } from "@angular/core";
import { ImagePicker,ImagePickerOptions } from '@ionic-native/image-picker';
import { FileTransfer, FileTransferObject }from'@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import {FileService} from "../../../providers/FileService";
import {GlobalData} from "../../../providers/GlobalData";
//import {CameraPopoverOptions} from "ionic-native";
import {Storage} from "@ionic/storage";
import {Helper} from "../../../providers/Helper";
/**
 * Generated class for the MyinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-myinfo',
  templateUrl: 'myinfo.html',
})
export class MyinfoPage {

  items :any= {} ;
  avatar : String = "";


  constructor(private navCtrl: NavController,
                private navParams: NavParams,
                private commonService : CommonService,
                private actionSheetCtrl:ActionSheetController,
                private camera:Camera,
                private FileService :FileService,
                private imagePicker:ImagePicker,
                private globalDate:GlobalData,
                private transfer:FileTransfer,
                private file:File,
                private fileTransfer:FileTransferObject,
                public alertCtrl:AlertController,
                public storage : Storage,
                private helper : Helper,
                public appCtrl : App
              ) {

        this.fileTransfer= this.transfer.create();
  }

  ionViewDidLoad() {
    let USER001 = this.globalDate.userId;
    this.initDate(USER001);
  }

  initDate(USER001){
      this.initInfo({USER001:USER001}).subscribe(data=>{
        if(data.userInfo){
         this.items = data.userInfo;
     }
  });
}

initInfo(paramMap?){
     return  this.commonService.getInfo(paramMap);
  }

  //更改头像
  Changeimage() {

    let actionSheet=
      this.actionSheetCtrl.create({
        title: '请选择',
        buttons: [
          {
            text: '拍照',
             role:'takePhoto',
            handler: ()=> {
              this.takePhoto();
              }
          },
          {
            text: '从手机相册选择',
            role:'choseFromAlum',
            handler: ()=> {
              this.choseFromAlum();
              }
           },
          {
            text: '取消',
            role: 'cancel',
            handler: ()=> {
            console.log("cancel");
            }
          }
         ]
      });
        actionSheet.present().then(value => {
          return value;
    });
  }

  // 启动拍照功能
  takePhoto(){
     //调用相机所携带的参数
    const options:CameraOptions ={
      quality: 100,
      allowEdit: true,
      targetWidth: 200,
      targetHeight: 200,
      saveToPhotoAlbum: true,
      };
     this.camera.getPicture(options).then(image=>{
         console.log("imge Url:"+image);
         //this.avatar=image.sample(7);
          this.avatar=image;
     },error=>{
         console.log("ERROR:"+error);
     });

  }

  //从相册中选择
  choseFromAlum(){
    const options: ImagePickerOptions = {
        maximumImagesCount: 1,
        width: 200,
        height: 200
    };
    this.imagePicker.getPictures(options).then(images => {
      if (images.length > 1) {
        this.presentAlert();
      } else if (images.length === 1) {
        console.log('Image URI: ' + images[0]);
        this.avatar = images[0];

      }
    }, error => {
      console.log('Error: ' + error);
    });

  }
  presentAlert() {
    let alert = this.alertCtrl.create({title: "上传失败", message: "只能选择一张图片作为头像哦", buttons: ["确定"]});
    alert.present().then(value => {
      return value;
    });
  }
  //退出登录
  LoginOut(){
    let alert = this.alertCtrl.create({
      title: '确定要退出吗？',
      buttons: [
        {
          text: '取消',
          handler: data => {
          }
        },
        {
          text: '确定',
          handler: data => {
            // this.storage.remove('token');
            // this.navCtrl.goToRoot({});
            // this.appCtrl.getRootNav().setRoot('LoginPage');
            this.helper.tuichudenglu();//统一退出登录方法
          }
        }]
    });
    alert.present();
  }







}
