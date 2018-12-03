import { Component } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import {GlobalData} from "../../providers/GlobalData";
import {CommonService} from "../../service/CommonService";
import {Helper} from "../../providers/Helper";
import {IonicPage, NavParams, ViewController,NavController,App} from "ionic-angular";
import {Storage} from '@ionic/storage';
import {UserInfo} from "../../model/UserInfo";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  submitted: boolean = false;
  loginForm: any;
  showHome: boolean = false;
  username:string = "";
  password:string = "";
  duigou:string = "none";
  constructor(public formBuilder : FormBuilder,
              public globalData : GlobalData,
              public commonService : CommonService,
              public storage : Storage,
              public helper : Helper,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              public navCtrl: NavController,
              private app: App) {
    //初始化密码
    this.storage.get("SaveThePassword").then(r=>{
      if(r){
        this.storage.get("SaveTheUsername").then(r2=>{
          this.username = r2;
        });
        this.password = r;
        this.duigou = "block";
      }
    });


    this.loginForm = this.formBuilder.group({
      username : [this.globalData.username,[Validators.required,Validators.minLength(2)]],
      password : ['',[Validators.required,Validators.minLength(3)]]
    })
  }

  login(user) {

    this.submitted = true;
    this.commonService.getToken(user.username, user.password).mergeMap(data => {
      this.globalData.token = data.token;
      this.storage.set('token', data.token);
      return this.commonService.getUserInfo();
    }).subscribe((userInfo:UserInfo) => {
      if(this.duigou == "block"){
        this.storage.set("SaveTheUsername",this.username);
        this.storage.set("SaveThePassword",this.password);
      }

      this.submitted = false;
      this.helper.loginSuccessHandle(userInfo);
      this.navCtrl.popToRoot();
      this.app.getRootNav().setRoot('TabsPage');
      this.showHome = true;
      //this.viewCtrl.dismiss({showHome:true});
    }, () => {
      this.password = '';
      this.submitted = false;
    });
  }

  ok(){
    if(this.password){
      this.storage.get("SaveThePassword").then(r=>{
        if(r && r != ""){
          this.duigou = "none";
          this.storage.remove("SaveTheUsername");
          this.storage.remove("SaveThePassword");
        }else{
          this.duigou = "block";
          this.storage.set("SaveTheUsername",this.username);
          this.storage.set("SaveThePassword",this.password);
        }
      })
    }else{
      if(this.duigou == "none"){
        this.duigou = "block";
      }else{
        this.duigou = "none";
      }
    }
  }

}
