
 import { Component } from '@angular/core';
 import {ActionSheetController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
 import {CommonService} from "../../../../service/CommonService";
 import {GlobalData} from "../../../../providers/GlobalData";
 import {Camera} from "ionic-native";
 import {Observable} from "rxjs/Rx";
 import {NativeService} from "../../../../providers/NativeService";
 import {Utils} from "../../../../providers/Utils";
 import {UploadFileService} from "../../../../providers/UploadFileService";

 /**
  * Generated class for the TasksignPage page.
  *
  * See https://ionicframework.com/docs/components/#navigation for more info on
  * Ionic pages and navigation.
  */

 @IonicPage()
 @Component({
   selector: 'page-conferencesigning',
   templateUrl: 'conferencesigning.html',
 })
 export class ConferencesigningPage {

   MEET001={};//会议/任务ID
   type='';//1.会议 2.任务 3 出勤
   imageList:any=[];//图片

   calt001: string;
   location: Array<any> = [];//经纬度集合
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
               public commonService:CommonService,
               public action:ActionSheetController,
               public  globalData:GlobalData,
               public alert:AlertController,
               public nativeService: NativeService,
               public uploadFileService: UploadFileService,
   ) {
   }

   ionViewDidLoad() {
     console.log('ionViewDidLoad TasksignPage');

     this.MEET001=this.navParams.get("MEET001");
     this.type=this.navParams.get("TYPE");
   }

   private initLocation() {
     let latitude_longitude = "39.92,116.46";
     let location = "北京";
     Observable.zip(this.nativeService.assertLocationService(), this.nativeService.assertLocationAuthorization()).subscribe(() => {
       GaoDe.getCurrentPosition((r) => {
         let latitude = r["latitude"];//纬度
         let longitude = r["longitude"];//经度
         //正式环境需解开注释
         if (latitude != undefined) {
           this.zb = longitude + "," + latitude;
           this.address = r["address"];
         } else {
           return this.nativeService.alert("当前定位失败！请稍后重试");
         }
       }, (e) => {
         //reject("startCamera02 err:" + JSON.stringify(e));
       });
     });
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

   // 启动拍照功能
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
     let mtsi001 = Utils.uuid();
     this.commonService.getPage('/huarui/hrswTMeetingtasksignin/addTaskSignIn',
       {
         MTSI001: mtsi001,
         MTSI002: this.MEET001,
         MTSI003: this.type,
         MTSI006: this.address,
         MTSI007: this.zb
       }).subscribe(() => {
       //上传图片
       this.uploadFileService.uploadFile({
         url: "/huarui/hrswTMeetingtasksignin/addPhoto", filePath: this.imageDataitem,
         fileParam: {SIPI002: mtsi001}
       })
         .then((data) => {
           setTimeout(2000);
           this.navCtrl.pop();
         }).catch(e => {
       });

     });
   }




   /*   //签到
      signIn(){

        this.commonService.getPage('/huarui/hrswTMeetingtasksignin/signIn',{
          MTSI002:this.MEET001,
          MTSI003:this.type
        }).auditTime(500)
          .subscribe(data=>{
            if(data.flage){
              let alert=this.alert.create({
                title:'签到成功!',
                buttons:[{
                  text:'确定',
                  handler:()=>{
                    this.navCtrl.pop();
                  }
                }]
              }).present();
            }else {
              let alert=this.alert.create({
                title:'签到失败!请重新签到',
                buttons:[{
                  text:'确定',
                  handler:()=>{

                  }
                }]
              }).present();
            }
          })

        //任务

      }*/



 }


