import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Utils} from "../../../../providers/Utils";
import {CommonService} from "../../../../service/CommonService";
import {Camera} from "ionic-native";
import {UploadFileService} from "../../../../providers/UploadFileService";
import {GlobalData} from "../../../../providers/GlobalData";

/**
 * Generated class for the AddbijiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addbiji',
  templateUrl: 'addbiji.html',
})
export class AddbijiPage {

  NOTE002:string;//标题
  NOTE003:string;//内容
  imageDataitem: any = [];//照片

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
                public commonservice:CommonService,
                public alert:AlertController,
                public uploadFileService: UploadFileService,
                public globdate:GlobalData) {
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad AddbijiPage');

  }

  //打开相机
  openCamera(obj) {
    this.startCamera(obj).then(r => {

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

  //点击删除照片
  deleteImg(param) {
    this.imageDataitem.remove(param);
  }

  submitNoteBook(){

    if(!this.NOTE002 || !this.NOTE003){
       let  alert=this.alert.create({
         title:'请您完善信息',
         buttons:[{
           text:'确定',
           handler:()=>{

           }
         }]
       }).present()
    }else{
        let NOTE001=Utils.uuid();

       let params: any = [];
        params['NOTE001'] = NOTE001;
        params['USER001']=this.globdate.userId;
        this.commonservice.getPage('/huarui/XzxyNoteBook/addNoteBook',{
          NOTE001:NOTE001,
          NOTE002:this.NOTE002,
          NOTE003:this.NOTE003,
        }).auditTime(500).subscribe(data=>{
          debugger
          if(data.flage){
            //上传图片
            let aa=this.imageDataitem;
            if(this.imageDataitem.length>=1){
              this.uploadFileService.uploadFile({
                url: "/huarui/XzxyNoteBook/addPhoto",
                filePath: this.imageDataitem,
                fileParam: params
              }).then((data) => {
                setTimeout(2000);
                let alert=this.alert.create({
                  title:'新建笔记成功！',
                  buttons:[{
                    text:'确定',
                    handler:()=>{
                      this.navCtrl.pop();
                    }
                  }]
                }).present();
              }).catch(e => {
                console.log(e);
              });
            }else{
              let alert=this.alert.create({
                title:'新建笔记成功！',
                buttons:[{
                  text:'确定',
                  handler:()=>{
                    this.navCtrl.pop();
                  }
                }]
              }).present();
            }


          }else{
            let aler=this.alert.create({
              title:'新建笔记失败！请稍后再试',
              buttons:[{
                     text:'确定',
                     handler:()=>{

                     }
              }]
            }).present();
          }
        })
    }
  }


}
