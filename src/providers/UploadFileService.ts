import {Injectable} from "@angular/core";
import {NativeService} from "./NativeService";
import {GlobalData,} from "./GlobalData";
import {APP_SERVE_URL} from './Constants';
import {Storage} from "@ionic/storage";
import {SqliteService} from "./SqliteService";
import {Transfer} from "ionic-native";
import {NoticeService} from "./NoticeService";
import {File} from "@ionic-native/file";
import {HttpService} from "./HttpService";


@Injectable()
export class UploadFileService {

  onSuccessUpload:any;//上传成功回调方法
  onFailUpload:any;//上传失败回调方法
  onAllUploadComplete:any;//所有上传完毕回调方法


  uploadQueue:Array<any> = [];//上传队列
  thisUpload:any;//正在上传的id
  isUpload:boolean = false;//是否正在上传
  timer01:any;//定时器01
  fileTransfer: Transfer;
  upload: any = {
    //url: APP_SERVE_URL +  '/app/doAppWorkPtoho',           //接收图片的url
    fileKey: 'image',  //接收图片时的key
    headers: {
      'Authorization':'Bearer ' + this.globalData.token,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' //不加入 发生错误！！
    },
    params: {},        //需要额外上传的参数
    success: (data) => {
      this.sqliteService.update_t_Uploading({index:1,STATUS01:1,id:data["id"]});
      this.onSuccessUploadFun(data);
      if(this.uploadQueue.length == 0){//所有上传成功回调方法
        this.onAllUploadCompleteFun(data);
      }
    }, //图片上传成功后的回调
    error: (err) => {
      // this.alertCtrl.create({
      //   title: 'error!!',
      //   subTitle: JSON.stringify(err),
      //   buttons: [{text: '取消'}
      //   ]
      // }).present();
      this.sqliteService.update_t_Uploading({index:2,STATUS01:2,id:err["id"]});
      this.onFailUploadFun(err);
      if(this.uploadQueue.length == 0){//所有上传成功回调方法
        this.onAllUploadCompleteFun(err);
      }
    },   //图片上传失败后的回调
    listen: () => {}   //监听上传过程
  };
  constructor(private nativeService: NativeService,
              private globalData: GlobalData,
              private storage: Storage,
              private noticeSer: NoticeService,
              private httpService : HttpService,
              private file: File,
              public sqliteService:SqliteService,
              //private alertCtrl: AlertController
              ) {
    this.initUploadFile();
  }

  /**
   * 初始化
   */
  private initUploadFile(){
    this.checkUploadFailure();

    //开启定时任务，每分钟检查一次有没有上传失败的文件
    if(!this.timer01){
      this.timer01 = setInterval(()=>{
        this.checkUploadFailure();
      },1000 * 60);
    }
  }
  //检测上传失败文件
  private checkUploadFailure(){
    //获取已经在队列中的id
    let ids:Array<any> = this.getWaitForUploadingId();
    //查询未上传完成的附件
    this.sqliteService.query({UploadingId:ids}).then((data:any)=>{
      // this.alertCtrl.create({
      //   title: 'data!!',
      //   subTitle: JSON.stringify(data),
      //   buttons: [{text: '取消'}
      //   ]
      // }).present();
      for(let i =0;i<data.length;i++){
        let itemnow = data.item(i);
        let id = itemnow.ID;
        let url = itemnow.URL01;
        let filePath:any = itemnow.FILEPATH;

        let param = JSON.parse(itemnow.PARAM01 || {});
        // this.alertCtrl.create({
        //   title: 'itemnow!!',
        //   subTitle: JSON.stringify(itemnow),
        //   buttons: [{text: '取消'}
        //   ]
        // }).present();
        this.uploadFile({url:url,filePath:filePath,fileParam:param,id:id})
      }
    }).catch(e=>{
      // this.alertCtrl.create({
      //   title: 'e!!',
      //   subTitle: e,
      //   buttons: [{text: '取消'}
      //   ]
      // }).present();
    });
  }

  //上传文件
  uploadFile(file:{url:string,filePath:any,fileParam:any,id?:number}){
    return new Promise((resolve, reject) => {
      if(file.id){//有id更新
        this.uploadQueue.push(file);//加入队列
        if(!this.isUpload){
          this.isUpload = true;//正在上传
          let thisFile = this.uploadQueue.shift();//从头部取出一个
          if(thisFile) {
            this.uploadFileRun(thisFile).then(() => {
              this.isUpload = false;//所有队列都上传完毕
              this.thisUpload = null;//上传id设为空
            }).catch(e=>{
              this.isUpload = false;
              this.thisUpload = null;//上传id设为空
              reject("uploadFile01 err:"+e);
            })
          }else{
            this.isUpload = false;
            this.thisUpload = null;//上传id设为空
          }
        }
        resolve(file);
      }else{
        //往数据库插入记录
        this.sqliteService.insert_t_Uploading(file).then(req=>{
          //insertId:number  数据id
          let param01:any = {...file,id:req["insertId"]};
          this.uploadQueue.push(param01);//加入队列
          if(!this.isUpload){
            this.isUpload = true;//正在上传
            let thisFile = this.uploadQueue.shift();//从头部取出一个
            if(thisFile) {
              this.uploadFileRun(thisFile).then(() => {
                this.isUpload = false;//所有队列都上传完毕
                this.thisUpload = null;//上传id设为空
              }).catch(e=>{
                this.isUpload = false;
                this.thisUpload = null;//上传id设为空
                reject("uploadFile01 err:"+e);
              })
            }else{
              this.isUpload = false;
              this.thisUpload = null;//上传id设为空
            }
          }
          resolve(param01);
        }).catch(e=>{
          reject("uploadFile02 err:"+e);
        });
      }
    });
  }
  //上传附件run
  private uploadFileRun(thisFile:any){
    this.thisUpload = thisFile;//正在上传的id
    return new Promise((resolve, reject) => {
      if(thisFile){
        this.uploadImg(thisFile).then(()=>{
          let thisFile02 = this.uploadQueue.shift();//从头部取出一个
          if(thisFile02){
            this.uploadFileRun(thisFile02).then((r)=>{
              resolve(r);
            }).catch(e=>{
              reject(e);
            });
          }else{
            resolve(true);
          }
        }).catch(e=>{
          reject("uploadFileRun err:"+e);
        });
      }else{
        resolve(true);
      }
    });
  }

  // 上传图片
  private uploadImg(thisFile:any) {
    return new Promise((resolve, reject) => {
      let filePath:any = thisFile["filePath"];//文件路径
      //这里要判断filePath是否是数组
      try{
        filePath = JSON.parse(filePath);
      }catch(e){}
      if(filePath && filePath.constructor == Array){
        this.uploadImgMany(thisFile).then((r)=>{
          resolve(r);
        }).catch(e=>{
          reject(e);
        });
      }else if(filePath && filePath.constructor == String){
        this.uploadImgSingle(thisFile).then((r)=>{
          resolve(r);
        }).catch(e=>{
          reject(e);
        });
      }else{
        reject("uploadImg01 err：filePath不能为空!");
      }
    });
  }

  // 上传图片(单张)
  private uploadImgSingle(thisFile:any) {
    return new Promise((resolve, reject) => {
      let id = thisFile["id"];
      let url = thisFile["url"];//接收图片的服务器路径
      let filePath = thisFile["filePath"];//文件路径
      let fileParam:any = thisFile["fileParam"];//文件参数
      if(!filePath) {
        reject("uploadImg01 err：filePath不能为空!");
        return;
      }

      this.fileTransfer = new Transfer();

      let options: any;
      options = {
        fileKey: this.upload.fileKey,
        headers: this.upload.headers,
        params: {...this.upload.params,...fileParam}
      };
      this.fileTransfer.upload(filePath, APP_SERVE_URL + url + "", options)
        .then((data) => {
          debugger;
          if(data){
            let data01:any = {};
            try{
              data01 = JSON.parse(data.response);
            }catch(e){
              data01 = data;
            }
            if(data01.Code == "3"){
              if(this.upload.error) {
                this.upload.error({err:data01.Description,id:id});
              }
              reject("uploadImg02 err："+data);
            }else if(data01.Code == "0"){
              if(this.upload.success) {
                this.upload.success({...JSON.parse(data.response),id:id});
              }
              resolve({...JSON.parse(data.response),id:id});
            }else{
              if(this.upload.error) {
                this.upload.error({data,id:id});
              }
              reject("uploadImg02 err："+data);
            }
          }else{
            if(this.upload.error) {
              this.upload.error({err:"data 为null",id:id});
            }
            reject("uploadImg02 err：data 为null");
          }
        }, (err) => {
          if(this.upload.error) {
            this.upload.error({err:err,id:id});
          } else {
            this.noticeSer.showToast('错误：上传失败！');
          }
          reject("uploadImg02 err："+JSON.stringify(err));
        });
      this.fileTransfer.onProgress((obj)=>{

      });
    });
  }

  // 上传图片（多张）
  private uploadImgMany(thisFile:any) {
    return new Promise((resolve, reject) => {
      let id = thisFile["id"];
      let url = thisFile["url"];//接收图片的服务器路径
      let filePath = thisFile["filePath"];//文件路径
      let filePaths:any = [];
      if(filePath && filePath.constructor == Array){
        filePaths = filePath;
      }else if(filePath && filePath.constructor == String){
        filePaths = JSON.parse(filePath);
      }
      let fileParam:any = thisFile["fileParam"];//文件参数
      if(!filePath) {
        reject("uploadImg01 err：filePath不能为空!");
        return;
      }

      this.getFiles(filePaths).then(r=>{
        for(let key in fileParam){
          r.append(key,fileParam[key]);
        }
        let token = this.globalData.token;
        $.ajax({
          url: APP_SERVE_URL + url,
          type: 'POST',
          headers : {'Authorization':`Bearer ${token}`},
          data: r,
          processData: false,
          contentType: false,
          success: (data)=> {
            if(data){
              try{
                data = JSON.parse(data);
              }catch(e){
              }
              if(data.Code == "3"){
                if(this.upload.error) {
                  this.upload.error({err:data.Description,id:id});
                }
                reject("uploadImg02 err："+data);
              }else if(data.Code == "0"){
                if(this.upload.success) {
                  this.upload.success({...data,id:id});
                }
                resolve({...data,id:id});
              }else if(data.errorMsg != ""){
                if(this.upload.error) {
                  this.upload.error({err:data.errorMsg,id:id});
                }
                reject("uploadImg02 err："+data.errorMsg);
              }else{
                if(this.upload.success) {
                  this.upload.success({...data,id:id});
                }
                resolve({...data,id:id});
              }
            }else{
              if(this.upload.success) {
                this.upload.success({...data,id:id});
              }
              resolve({...data,id:id});
            }
          },
          error: (err)=> {
            if(this.upload.error) {
              this.upload.error({err:err,id:id});
            } else {
              this.noticeSer.showToast('错误：上传失败！');
            }
            reject("uploadImg03 err："+JSON.stringify(err));
          }
        });

      });

    });
  }

  getFiles(filePaths:Array<any>):Promise<FormData>{
    return new Promise((resolve, reject) => {
      let filePath = filePaths.pop();
      if(filePath){
        let index = filePath.lastIndexOf("/");
        let fileName = filePath.substring(index + 1, filePath.length);
        let directoryUrl = filePath.substring(0, index);
          this.file.resolveDirectoryUrl(directoryUrl).then(req02 => {
          this.file.getFile(req02, fileName, {create: true}).then(req03 => {
            req03.file(file => {
              let reader = new FileReader();
              reader.onloadend = (e2) => {
                let userFriendsConfig = reader.result;
                if (userFriendsConfig) {
                  try {
                    let the_file = new Blob([userFriendsConfig], { type: "image/jpeg" } );
                    if(filePaths.length != 0){
                      this.getFiles(filePaths).then(r=>{
                        r.append("files", the_file,fileName);
                        resolve(r);
                      });
                    }else{
                      let formData = new FormData();
                      formData.append("files", the_file,fileName);
                      resolve(formData);
                    }
                  } catch (e) {
                    console.log("JSON.stringify(userFriendsConfig) err:" + e);
                  }
                }
              };
              reader.readAsArrayBuffer(file);
            });
          });
        });
      }else{
        if(filePaths.length != 0){
          this.getFiles(filePaths).then(r=>{
            resolve(r);
          });
        }
      }
    });
  }

  // 停止上传
  stopUpload() {
    if(this.fileTransfer) {
      this.fileTransfer.abort();
    }
  }

  /**
   * 获得等待上传的附件id，包括在队列中的和正在上传中的id
   */
  getWaitForUploadingId(){
    let ids:Array<any> = [];
    for(let thisUpload of this.uploadQueue){
      ids.push(thisUpload);
    }
    if(this.isUpload && this.thisUpload && this.thisUpload["id"]){//正在上传取正在上传的id
      ids.push(this.thisUpload);
    }
    return ids;
  }

  /**
   * 上传成功回调方法
   */
  private onSuccessUploadFun(obj){
    if(this.onSuccessUpload){
      try{
        this.onSuccessUpload(obj);
      }catch (e){}
    }
  }

  /**
   * 上传失败回调方法
   */
  private onFailUploadFun(obj){
    if(this.onFailUpload){
      try{
        this.onFailUpload(obj);
      }catch (e){}
    }
  }
  /**
   * 所有文件全部上传成功回调方法
   * @param obj
   */
  private onAllUploadCompleteFun(obj){
    if(this.onAllUploadComplete){
      try{
        this.onAllUploadComplete(obj);
      }catch (e){}
    }
  }
}
