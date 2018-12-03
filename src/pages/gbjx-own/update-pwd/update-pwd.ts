import { Component } from '@angular/core';
import {AlertController, App, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../service/CommonService";
import {GlobalData} from "../../../providers/GlobalData";
import {Storage} from "@ionic/storage";
/**
 * Generated class for the UpdatePwdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-pwd',
  templateUrl: 'update-pwd.html',
})
export class UpdatePwdPage {

  userid:any;//用户名
  oldPwd:any;//旧密码
  newPwd01:any;//新密码
  newPwd02:any;//确认新密码

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alert:AlertController,
              public commonService:CommonService,
              public storage:Storage,
              public appCtrl:App,
              public globaData:GlobalData) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdatePwdPage');
  }

  updatePwd(){
    if(!this.oldPwd){
      let alert=this.alert.create({
        title:'旧密码不能为空',
        buttons:[{
          text:"确定",
          handler:()=>{

          }
        }]
      }).present()

    }else{
      if(!this.newPwd01 || !this.newPwd02){
        let alert=this.alert.create({
          title:'新密码不能为空',
          buttons:[{
            text:"确定",
            handler:()=>{

            }
          }]
        }).present()
      }else{

        if(this.oldPwd==this.newPwd01){
          let alert=this.alert.create({
            title:'旧密码不能与新密码一样！',
            buttons:[{
              text:"确定",
              handler:()=>{
                this.newPwd01='';
                this.newPwd02='';
              }
            }]
          }).present()

        }else{

          if(this.newPwd01 !=this.newPwd02){
            let alert=this.alert.create({
              title:"两次输入密码不一致！请您重新输入！",
              buttons:[{
                text:"确定",
                handler:()=>{
                  this.newPwd01='';
                  this.newPwd02='';
                }
              }]
            }).present()
          }else{
            this.commonService.getPage('/mine/checkPwd',{
              oldpassword:this.oldPwd
            }).subscribe(data=>{
              let flage=data.flage;
              if(flage){
                this.commonService.getPage('/mine/updatekPwd',{
                  newpassword:this.newPwd02
                }).subscribe(data02=>{
                  let flag=data02.flage;
                  if(flag){
                    let alert=this.alert.create({
                      title:'修改密码成功！请您重新登陆！',
                      buttons:[{
                        text:'确定',
                        handler:()=>{
                          this.storage.remove("token");
                          this.navCtrl.goToRoot({});
                          this.appCtrl.getRootNav().setRoot('LoginPage');
                        }
                      }]
                    }).present()
                  }else{
                    let alert=this.alert.create({
                      title:'修改密码失败！请您重新尝试',
                      buttons:[{
                        text:'确定',
                        handler:()=>{
                        }
                      }]
                    }).present()
                  }
                })
              }else{
                let alert=this.alert.create({
                  title:"您输入的旧密码有误！请您重新输入",
                  buttons:[{
                    text:'确定',
                    handler:()=>{

                    }
                  }]
                }).present()
              }
            })
          }

        }
      }
    }

  }

}
