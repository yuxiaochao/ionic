import {Component, ViewChild} from '@angular/core';
import {
  ActionSheetController, AlertController, Content, InfiniteScroll, IonicPage, LoadingController, NavController,
  NavParams, ViewController
} from 'ionic-angular';

import {CommonService} from "../../../../../service/CommonService";
import {GlobalData} from "../../../../../providers/GlobalData";


@IonicPage()
@Component({
  selector: 'page-userPhotoOperation',
  templateUrl: 'userPhotoOperation.html',
})
export class UserPhotoOperationPage {


  items : any = [];//全局变量   列表数据
  start : number = 1;
  unRecord : boolean = false;
  myInput : string = '';
  strlist : any=[];
  isflag :any =true;
  dto2list : any=[];
  showTimeFrame: number = -1;
  //定义是否点击上传
  isuplode:boolean =false;
  box_fo_isShow: boolean = false;//是否显示“没有更多信息了”

  avatar:any;
  imagePicker:any;

  @ViewChild(Content) content: Content;
  @ViewChild(InfiniteScroll) infiniteScroll :InfiniteScroll;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public commonService : CommonService,
    public globalData: GlobalData,
    public alertCtrl:AlertController,
    public viewCtrl: ViewController
  ) {}
  //第一次点进去的时候执行，加载的东西，只执行第一次
  ionViewDidLoad() {
    console.log('ionViewDidLoad BanjixiangcePage');
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
    //this.infiniteScroll.enable(true);//初始化  滚动
    this.strlist = this.globalData.currentTrainingClass;
    this.initSelectPhotoForUserid()
      .subscribe(data=>{//处理接口返回的数据，必须调用
        if(data.userPhotoList && data.userPhotoList.length >= 1){
          this.items = data.userPhotoList;
        }else{
          this.unRecord = true;
        }
      });
  }

  //根据id删除图片
  initClassesPhotodelete(paramMap?){
    return this.commonService.getPage('/classes/deletePhoto',{picIdList:paramMap});
  }
  //根据上传人的id查询图片
  initSelectPhotoForUserid(paramMap?){
    return this.commonService.getPage('/classes/selectPhotoforUserId',paramMap);
  }

//点击选择
  clicktoselect(){
    this.isflag=false;
  }

  choosePic(fitem){
    if(this.isflag == false){
      fitem["isPic"] = fitem["isPic"] == 1?0:1;
    }
  }
  //点击删除
  clicktodelete(){
    this.isflag=true;
    for(let i=0;i<this.items.length;i++) {
      if (this.items[i].isPic) {
        if (this.items[i].isPic == 1) {
          this.dto2list.push(this.items[i].TRPH001);
        }
      }
    }
    this.alertCtrl.create({
      message: '确定要删除吗？',
      buttons: [
        {
          text: '取消',
          handler: () => {
          }
        },
        {
          text: '确定',
          handler: () => {
             this.initClassesPhotodelete(this.dto2list).subscribe(data=>{
               if(data.success > 0){
                 console.log("删除成功");
                 let alert = this.alertCtrl.create({
                   title: '提示',
                   subTitle: '删除成功',
                   buttons: ['确定']
                 });
                 alert.present();
               }
             });
             this.initData();
          }
        }
      ]
    }).present();
  }


  //上拉加载下一页
  doInfinite3(infiniteScroll) {
    this.globalData.showLoading = false;
    this.showTimeFrame = -1;
    this.initSelectPhotoForUserid({LIMIT: 10, START: ++this.start}).subscribe(data => {
      if (data.userPhotoList.length > 0 && data.userPhotoList.length >= 1) {
        this.items = this.items.concat(data.userPhotoList);
      } else {
        this.box_fo_isShow = true;//没有更多数据了
        infiniteScroll.enable(false);
      }
      infiniteScroll.complete();
    });
    this.globalData.showLoading = true;
  }


}
