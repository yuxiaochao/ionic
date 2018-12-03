import {Component, ViewChild} from '@angular/core';
import {
  ActionSheetController,
  AlertController, Content, InfiniteScroll, IonicPage, Navbar, NavController, NavParams,
  ViewController
} from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";
import {GlobalData} from "../../../../providers/GlobalData";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker,ImagePickerOptions } from '@ionic-native/image-picker';
import {UserPhotoOperationPage} from "./userPhotoOperation/userPhotoOperation";

/**
 * Generated class for the BanjixiangcePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-banjixiangce',
  templateUrl: 'banjixiangce.html',
})
export class BanjixiangcePage {

  items : any = [];//全局变量   列表数据
  start : number = 1;
  unRecord : boolean = false;
  myInput : string = '';
  strlist : any=[];
  showTimeFrame: number = -1;
  isflag :any =true;
  dto2list : any=[];
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
    public viewCtrl: ViewController,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera
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
    // this.start=1;//分页   第一页
    // this.infiniteScroll.enable(true);//初始化  滚动
    this.strlist = this.globalData.currentTrainingClass;
    this.initClassesPhotoList()
      .subscribe(data=>{//处理接口返回的数据，必须调用
        if(data.classesPhotoList && data.classesPhotoList.length >= 1){
          this.items = data.classesPhotoList;

          console.log(this.items)
        }else{
          this.unRecord = true;
        }
      });
  }

  //请求接口路径   url  /study/onlineStudyList
  initClassesPhotoList(paramMap?){
    return this.commonService.getPage('/classes/classesPhoto',paramMap);
  }

  //根据id删除图片
  initClassesPhotodelete(paramMap?){
    return this.commonService.getPage('/classes/deletePhoto',{picIdList:paramMap});
  }
  //根据上传人的id查询图片
  initSelectPhotoForUserid(paramMap?){
    return this.commonService.getPage('/classes/selectPhotoforUserId',paramMap);
  }
  clickShowUserPhoto(){
    // this.isflag=false;
    this.navCtrl.push('UserPhotoOperationPage');
    this.initSelectPhotoForUserid()
      .subscribe(data=>{//处理接口返回的数据，必须调用
        if(data.userPhotoList && data.userPhotoList.length >= 1){
          this.items = data.userPhotoList;
          // for(let i=0;i<this.items.length;i++){
          //   debugger
          //   this.items[i]["PHOTOESPATH"]= this.items[i]["PHOTOESPATH"].split(",");
          // }
          console.log(this.items)
        }else{
          this.unRecord = true;
        }
      });
  }
  clicktodelete(){
    this.isflag=true;
    for(let i=0;i<this.items.length;i++){
      for(let j=0;j<this.items[i].dtolist.length;j++){
        if(this.items[i].dtolist[j].isPic){
          if(this.items[i].dtolist[j].isPic == 1){
            this.dto2list.push(this.items[i].dtolist[j].dto2);
          }
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
            console.log(this.dto2list);
            debugger;
            this.initClassesPhotodelete(this.dto2list).subscribe(()=>{});
            // this.initData();
          }
        }
      ]
    }).present();
  }

  clickuplode(){
    this.isuplode=true;
  }
  disappear(){
    this.isuplode=false;
  }

  //更改头像
  Changeimage() {

    let actionSheet =
      this.actionSheetCtrl.create({
        title: '请选择',
        buttons: [
          {
            text: '拍照',
            role: 'takePhoto',
            handler: () => {
              //跳转页面
              this.navCtrl.push('ClassPhotoUplodePage');

              // this.takePhoto();
            }
          },
          {
            text: '从手机相册选择',
            role: 'choseFromAlum',
            handler: () => {
              this.choseFromAlum();
            }
          },
          {
            text: '取消',
            role: 'cancel',
            handler: () => {
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
  takePhoto() {
    //调用相机所携带的参数
    const options: CameraOptions = {
      quality: 100,
      allowEdit: true,
      targetWidth: 200,
      targetHeight: 200,
      saveToPhotoAlbum: true,
    };
    this.camera.getPicture(options).then(image => {
      console.log("imge Url:" + image);
      //this.avatar=image.sample(7);
      this.avatar = image;
    }, error => {
      console.log("ERROR:" + error);
    });

  }

  //从相册中选择
  choseFromAlum() {
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




  //上拉加载下一页
  doInfinite3(infiniteScroll) {
    this.globalData.showLoading = false;
    this.showTimeFrame = -1;
    this.initClassesPhotoList({LIMIT: 10, START: ++this.start}).subscribe(data => {
      if (data.classesPhotoList.length > 0 && data.classesPhotoList.length >= 1) {
        this.items = this.items.concat(data.classesPhotoList);
      } else {
        this.box_fo_isShow = true;//没有更多数据了
        infiniteScroll.enable(false);
      }
      infiniteScroll.complete();
    });
    this.globalData.showLoading = true;
  }

  choosePic(dto){
    if(this.isflag == false){
      dto["isPic"] = dto["isPic"] == 1?0:1;
    }
  }

}
