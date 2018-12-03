import {Component, ViewChild} from '@angular/core';
import {Content, InfiniteScroll, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ChakangenduoPage} from "./chakangenduo/chakangenduo";
import {CommonService} from "../../../../service/CommonService";
import {GlobalData} from "../../../../providers/GlobalData";

/**
 * Generated class for the TongzhigonggaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tongzhigonggao',
  templateUrl: 'tongzhigonggao.html',
})
export class TongzhigonggaoPage {

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
    public globalData: GlobalData
  ) {}

  //第一次点进去的时候执行，加载
  ionViewDidLoad() {
    console.log('ionViewDidLoad TongzhigonggaoPage');
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
    this.initClassesPhotoList({classesId:this.strlist.TRUS016})
      .subscribe(data=>{//处理接口返回的数据，必须调用
        if(data.classesAnnouncementList && data.classesAnnouncementList.length >= 1){
          this.items = data.classesAnnouncementList;
          console.log(this.items)
        }else{
          this.unRecord = true;
        }
      });
  }

  //请求接口路径   url  /study/onlineStudyList
  initClassesPhotoList(paramMap?){
    return this.commonService.getPage('/classes/ttb/classesAnnouncement',paramMap);
  }

  recordClick(obj){
    this.navCtrl.push('ChakangenduoPage',{more:obj});
  }
}
