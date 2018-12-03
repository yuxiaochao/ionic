import {Component} from '@angular/core';
import {ActionSheetController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";

@IonicPage()
@Component({
  selector: 'page-my-info',
  templateUrl: 'my-info.html',
})
export class MyInfoPage {

  userInfo: any = [];//用户信息
  sex: string;//性别
  trus012: string;//工作单位
  trus007: string;//职务
  trus005: string;//手机号
  trus011: string;//邮箱
  avatar: String = "";
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService,
              private actionSheetCtrl: ActionSheetController,
              private camera: Camera,
              private imagePicker: ImagePicker,
              public alertCtrl: AlertController,) {
  }

  ionViewDidLoad() {
    this.userInfo = this.navParams.get('userInfo');
    this.sex = this.userInfo.USER006;
    this.trus012 = this.userInfo.TRUS012;//工作单位
    this.trus007 = this.userInfo.TRUS007;//职务
    this.trus005 = this.userInfo.TRUS005;//手机号
    this.trus011 = this.userInfo.TRUS011;//邮箱
  }


  ionViewWillLeave() {//离开页面事件--保存数据
    if(this.sex==this.userInfo.USER006
      &&this.trus012==this.userInfo.TRUS012
      &&this.trus007==this.userInfo.TRUS007
      &&this.trus005==this.userInfo.TRUS005
      &&this.trus011==this.userInfo.TRUS011){
      return;
    }
    this.commonService.getPage('/mine/updateUserInfo',
      {
        sex: this.sex,
        trus012: this.trus012,
        trus007: this.trus007,
        trus005: this.trus005,
        trus011: this.trus011
      }).subscribe(data => {
    });
  }

  changeimage() {
    let actionSheet =
      this.actionSheetCtrl.create({
        title: '请选择',
        buttons: [
          {
            text: '拍照',
            role: 'takePhoto',
            handler: () => {
              this.takePhoto();
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

}
