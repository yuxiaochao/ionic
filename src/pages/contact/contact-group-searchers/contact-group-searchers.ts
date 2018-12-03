import {Component, ViewChild} from '@angular/core';
import {
  ActionSheetController, AlertController, Content, InfiniteScroll, IonicPage, Navbar, NavController,
  NavParams
} from 'ionic-angular';
import {ContactGroupChatMessagePage} from "../contact-group-chat-message/contact-group-chat-message";
import {GlobalData} from "../../../providers/GlobalData";
import {CommonService} from "../../../service/CommonService";
import {ContactgroupcreatPage} from "./contactgroupcreat/contactgroupcreat";
import {EasemobChatService} from "../../../providers/EasemobChatService";


/**
 * Generated class for the ContactGroupSearchersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-group-searchers',
  templateUrl: 'contact-group-searchers.html',
})
export class ContactGroupSearchersPage {

  items : any = [];
  unRecord : boolean = false;
  myInput : string = '';
  start = 1;
  peopleList:any=[];
  groupInfo:any={};
  groupList:any=[];

  @ViewChild(Content) content: Content;
  @ViewChild(InfiniteScroll) infiniteScroll :InfiniteScroll;
  @ViewChild(Navbar) navbar : Navbar;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public globalData : GlobalData,
              public commonService : CommonService,
              private eoChatService:EasemobChatService,
              public alertCtr:AlertController,
              public  actionSheetCtr:ActionSheetController) {
  }

  ionViewDidLoad() {
    this.initDate();
  }
  ionViewDidEnter(){
    //this.initDate();
  }

  initDate(){
    this.content.scrollToTop(0);
    this.unRecord = false;
    this.start = 1;
    this.infiniteScroll.enable(true);

    this.initInfo({}).subscribe(data => {
      if (data.groupsList && data.groupsList.length >= 1) {
        this.items = data.groupsList;
        this.pepleNumDate(this.items);
      }
    })
  }

  pepleNumDate(obj){

    for(let i=0;i<obj.length;i++){

      this.peopleNum({GROU001:obj[i]["GROU001"]}).auditTime(500).subscribe(data01=>{
        if(data01.groupMemberList && data01.groupMemberList.length>=0){
          this.peopleList=data01.groupMemberList;
          this.groupInfo=data01.groupByIdMap;
          let groupTotalNum= this.groupInfo.MEMBERCOUNT;
          let groupName=obj[i].GROU002;
          let GROU001=obj[i].GROU001;
          let group={
            "groupTotalNum":groupTotalNum,
            "GROU002":groupName,
            "GROU001":GROU001
          }
          debugger
          this.groupList.push(
            group
          )
        }

      })
    }

  }



  peopleNum(paramMap?){
    return this.commonService.getPage('/cts/groups/queryGroupDetails',paramMap);
  }

  ionFocus(){
    console.log("ionFocus()");
   /* this.navbar.hideBackButton=true;*/
  }

  ionCancel(){
    console.log("ionCancel()");
   /* this.navbar.hideBackButton=false;
    this.initDate();*/
  }

  ionClear(){
    console.log("ionClear()");
    this.initDate();
  }

  ionInput(ev: any){
    if(!ev.target.value){
      return;
    }
    this.infiniteScroll.enable(true);
    this.content.scrollToTop(0);
    this.globalData.showLoading = false;

    this.commonService.getPage('/cts/groups/queryMyFriendsAndGroup',{
      KEYWORD:ev.target.value,
    }).subscribe(data=>{
      if(data.MyGroups.length>0){
        this.unRecord = false;
        this.items = data.MyGroups;
      }else{
        this.items = [];
        this.unRecord = true;
      }
    });
    this.globalData.showLoading = true;
  }
  initInfo(paramMap?){
    return this.commonService.getPage('/cts/groups/list.action',paramMap);
  }


  //创建群组
  createGroup(){
     let flage=0;//判断创建还是修改 0创建   1修改
    this.navCtrl.push('ContactgroupcreatPage',{FLAGE:flage});
  }

  //删除群组
 /* deleteGroup(item){
    let  alert=this.alertCtr.create({
      title:"确定要删除吗",
      buttons:[{
               text:"取消",
               handler:data=>{
                 }
               },
              {
                text:"确定",
                handler:data=>{
                  this.commonService.getPage('/cts/groups/removeGroup',{
                    GROU001:item.GROU001,
                    GROU004:item.GROU004,
                  }).subscribe(data=>{
                    let succ=data.success;
                    if(succ==1||succ=="1"){
                      this.initDate();
                    }
                  })
                }

      }]
    })
    alert.present();
  }*/

  //修改群组
  updateGroup(item){
     let flage=1;
    this.navCtrl.push('ContactgroupcreatPage',{ITEM:item,FLAGE:flage});

  }

  //进入聊天界面
  groupChat(item){

    this.navCtrl.push('ContactGroupChatMessagePage',{ITEM:item});

    // let actionSheet=this.actionSheetCtr.create({
    //   title:"请选择",
    //   buttons:[
    //     {
    //       text:'聊天',
    //       handler:()=>{
    //
    //         }
    //     },
    //     {
    //       text:'删除',
    //       handler:()=>{
    //         let  alert=this.alertCtr.create({
    //           title:"确定要删除吗",
    //           buttons:[{
    //             text:"取消",
    //             handler:data=>{
    //             }
    //           },
    //             {
    //               text:"确定",
    //               handler:data=>{
    //                 this.commonService.getPage('/cts/groups/removeGroup',{
    //                   GROU001:item.GROU001,
    //                   GROU004:item.GROU004,
    //                 }).subscribe(data=>{
    //                   let succ=data.success;
    //                   if(succ==1||succ=="1"){
    //                     this.initDate();
    //                   }
    //                 })
    //               }
    //
    //             }]
    //         });
    //         alert.present();
    //       }
    //     },
    //     {
    //         text:'取消',
    //         role:'cancel',
    //       handler:()=>{
    //
    //       }
    //     }
    //   ]
    // });
    // actionSheet.present().then(value => {
    //   return value;
    // });

  }

  //下滑加载
  doInfinite(infiniteScroll) {
    this.globalData.showLoading = false;

    /*this.initInfo({ KEYWORD:this.myInput,START:++this.start})
      .auditTime(500)
      .subscribe(data=>{
        if(data.groupsList.length > 0){
          this.items = this.items.concat(data.groupsList);
        }else{
          infiniteScroll.enable(false);
        }
        infiniteScroll.complete();

      })*/
    this.commonService.getPage('/cts/groups/queryMyFriendsAndGroup',{
      KEYWORD:this.myInput,
      START:++this.start
    }).auditTime(500).subscribe(data=>{
      if(data.MyGroups.length > 0){
        this.items = this.items.concat(data.MyGroups);
      }else{
        infiniteScroll.enable(false);
      }
      infiniteScroll.complete();
    });
    this.globalData.showLoading = true;
  }

  clickItem02(obj){
    console.log("clickItem02()");
    let  alert=this.alertCtr.create({
                title:"确定要删除吗",
                buttons:[{
                  text:"取消",
                  handler:data=>{
                    this.initDate();
                  }
                },
                  {
                    text:"确定",
                    handler:data=>{
                      this.commonService.getPage('/cts/groups/removeGroup',{
                        GROU001:obj.GROU001,
                        GROU004:obj.GROU004,
                      }).subscribe(data=>{
                        let succ=data.success;
                        if(succ==1||succ=="1"){
                          this.initDate();
                        }
                      })
                    }

                  }]
              });
              alert.present();

  }
}
