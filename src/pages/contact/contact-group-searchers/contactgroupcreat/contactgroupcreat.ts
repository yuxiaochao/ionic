import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormBuilder} from "@angular/forms";
import {GlobalData} from "../../../../providers/GlobalData";
import {CommonService} from "../../../../service/CommonService";
import {ContactGroupSearchersPage} from "../contact-group-searchers";
import {ContactGroupChatMessageSetupPage} from "../../contact-group-chat-message/contact-group-chat-message-setup/contact-group-chat-message-setup";

/**
 * Generated class for the ContactgroupcreatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contactgroupcreat',
  templateUrl: 'contactgroupcreat.html',
})
export class ContactgroupcreatPage {

  groupName = "";
  groupInfo = "";
  myindex : number;
  flage : number;
  item: any ={};


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public globalData :GlobalData,
              public commonService : CommonService,
              public alertCtrl : AlertController) {

  }

  ionViewDidLoad() {
   this.flage=this.navParams.get("FLAGE");
   if(this.flage==1){
     this.item=this.navParams.get("ITEM");
     this.groupName=this.item.GROU002;
     this.groupInfo=this.item.GROU009;
   }

  }

  //修改群组信息
updateGroup(){
    this.commonService.getPage('/cts/groups/edit',{
      grou001:this.item.GROU001,
      grou002:this.groupName,
      grou009:this.groupInfo
  }).subscribe(data=>{
      let succ=data.success;
      if(succ==1||succ=="1"){
        let alert = this.alertCtrl.create({
          subTitle: '群/讨论组修改成功',
          buttons: [{
            text: "确定",
            handler: data => {
              let flage=false;
              this.navCtrl.pop();
            }
          }]
        });
        alert.present();
      }
    })

}

  //创建群
  createGroup(){
    this.globalData.showLoading = false;
    this.commonService.getPage("/cts/groups/add.action", {
      USER001: this.globalData.userId,
      grou002: this.groupName,
      grou003:1,
      grou009: this.groupInfo,
      grou011:22,
      grou012:0,
    }).subscribe(data => {
        let succ = data.success;
        if (succ == 1 || succ == "1") {
          this.globalData.showLoading = true;
          let alert = this.alertCtrl.create({
            subTitle: '群/讨论组创建成功',
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
