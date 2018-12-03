import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ContactGroupPublicPage} from "./contact-group-public/contact-group-public";
import {ContactGroupGroupphotoesPage} from "./contact-group-groupphotoes/contact-group-groupphotoes";
import {ContactGroupGroupfilesPage} from "./contact-group-groupfiles/contact-group-groupfiles";
import {CommonService} from "../../../../service/CommonService";
import {GroupAddPeoplePage} from "./group-add-people/group-add-people";
//import {GroupPeopleInfoPage} from "./group-people-info/group-people-info";

/**
 * Generated class for the ContactGroupChatMessageSetupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-group-chat-message-setup',
  templateUrl: 'contact-group-chat-message-setup.html',
})
export class ContactGroupChatMessageSetupPage {

  GROU002 = "";
  GROU001="";
  items : any ;
  public item : any = {};
  groupnumber : any ={};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService : CommonService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactGroupChatMessageSetupPage');
      this.item=this.navParams.get("ITEM");
      this.GROU002=this.item.GROU002;
      this.GROU001=this.item.GROU001;
      this.initData(this.GROU001);
  }
  ionViewDidEnter(){

    this.GROU002=this.item.GROU002;
    this.initData(this.GROU001);
  }



  //获取群成员
  initData(GROU001){

   this.intInfo({GROU001:this.GROU001}).subscribe(data=>{
      if(data.groupMemberList && data.groupMemberList.length>=0){
              this.items=data.groupMemberList;
              this.groupnumber=data.groupByIdMap;
      }
   })
  }

  intInfo(paramMap?){
    return this.commonService.getPage('/cts/groups/queryGroupDetails',paramMap);
  }

 //修改讨论组的名称
  updateGroup(item){
    let flage=1;
    this.navCtrl.push('ContactgroupcreatPage',{ITEM:this.item,FLAGE:flage});
  }

  //公告
  groupPublic(){
    this.navCtrl.push('ContactGroupPublicPage',{GROU001:this.GROU001});

  }

  //共享文件
  groupFile(){
    this.navCtrl.push('ContactGroupGroupfilesPage');
  }

  //群相册
  groupPhotoes(){
     this.navCtrl.push('ContactGroupGroupphotoesPage');
  }

  //群添加用户
  addPeople(obj,obj02){
    this.navCtrl.push('GroupAddPeoplePage',{GROU001:obj,GROU002:obj02});
  }

  //群成员信息
  peopleInfo(obj,obj02){
    this.navCtrl.push('GroupPeopleInfoPage',{PEOPLE:obj,GROUPNAME:obj02});
  }
}
