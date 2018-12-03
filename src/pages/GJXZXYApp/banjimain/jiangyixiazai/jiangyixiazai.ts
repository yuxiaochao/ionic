import {Component, ViewChild} from '@angular/core';
import {Content, InfiniteScroll, IonicPage, NavController, NavParams} from 'ionic-angular';
import {JiangyiyulanPage} from "./jiangyiyulan/jiangyiyulan";
import {CommonService} from "../../../../service/CommonService";
import {GlobalData} from "../../../../providers/GlobalData";
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

/**
 * Generated class for the JiangyixiazaiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-jiangyixiazai',
  templateUrl: 'jiangyixiazai.html',
})
export class JiangyixiazaiPage {



  items : any = [];//全局变量   列表数据
  start : number = 1;
  unRecord : boolean = false;
  myInput : string = '';
  strlist : any=[];

  @ViewChild(Content) content: Content;
  @ViewChild(InfiniteScroll) infiniteScroll :InfiniteScroll;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public commonService : CommonService,
    public globalData: GlobalData,
    private transfer: FileTransfer,
    private file: File,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JiangyixiazaiPage');
  }


  //入口函数
  ionViewDidEnter(){
    this.initData();
  }

  //请求接口数据
  initData(){
    this.content.scrollToTop(0);//滚动到最上面
    this.unRecord = false;
    this.start=1;//分页   第一页
    // this.infiniteScroll.enable(true);//初始化  滚动
    this.strlist = this.globalData.currentTrainingClass;
    this.initClassesPhotoList()
      .subscribe(data=>{//处理接口返回的数据，必须调用
        if(data.classesHandoutList && data.classesHandoutList.length >= 1){
          this.items = data.classesHandoutList;
          console.log(this.items)
        }else{
          this.unRecord = true;
        }
      });
  }

  //请求接口路径   url  /study/onlineStudyList
  initClassesPhotoList(paramMap?){
    return this.commonService.getPage('/classes/thd/classesHandout',paramMap);
  }

  yulanClick(obj){
    this.navCtrl.push('JiangyiyulanPage',{preview:obj});
  }

}
