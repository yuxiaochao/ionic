import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalData} from "../../../../../../providers/GlobalData";
import {CommonService} from "../../../../../../service/CommonService";

/**
 * Generated class for the AddpublicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addpublic',
  templateUrl: 'addpublic.html',
})
export class AddpublicPage {

  headerName = "";
  contentName="";
  GROU001 = " ";
  items : any ;
  flage : number;
  NOT003 : string;
  NOT004 :string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public globalData:GlobalData,
              public commonService: CommonService,
              public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddpublicPage');
    this.GROU001=this.navParams.get("GROU001");
    this.flage=this.navParams.get("FLAGE");
    if(this.flage==1){
      this.items=this.navParams.get("ITEMS");
      this.headerName=this.items.NOT003;
      this.contentName=this.items.NOT004;
    }
  }

  //修改
  changePublic(){
    this.globalData.showLoading = false;
    this.commonService.getPage('/cts/groups/editNotice.action',{
      USER001: this.globalData.userId,
      NOT001:this.items.NOT001,
      NOT003:this.headerName,
      NOT004:this.contentName
    }).subscribe(data=>{
      let succ = data.success;
      if (succ == 1 || succ == "1") {
        this.globalData.showLoading = true;
        let alert = this.alertCtrl.create({
          subTitle: '修改成功！',
          buttons: [{
            text: "确定",
            handler: data => {
              this.navCtrl.pop();
            }
          }]
        });
        alert.present();
      }
    });

  }


  //发布
  createpublic(){
    this.globalData.showLoading = false;
    this.commonService.getPage("/cts/groups/publishNotice.action", {
      USER001: this.globalData.userId,
      NOT002:this.GROU001,
      NOT003:this.headerName,
      NOT004:this.contentName
    }).subscribe(data => {
        let succ = data.success;
        if (succ == 1 || succ == "1") {
          this.globalData.showLoading = true;
          let alert = this.alertCtrl.create({
            subTitle: '发布成功成功！',
            buttons: [{
              text: "确定",
              handler: data => {
                this.navCtrl.pop();
              }
            }]
          });
          alert.present();
        }
      });

  }

}
