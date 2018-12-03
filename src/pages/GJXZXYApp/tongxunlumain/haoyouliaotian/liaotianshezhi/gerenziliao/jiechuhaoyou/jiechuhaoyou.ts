import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the JiechuhaoyouPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-jiechuhaoyou',
  templateUrl: 'jiechuhaoyou.html',
})
export class JiechuhaoyouPage {

  constructor(public navCtrl: NavController,
              public alertCtrl:AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JiechuhaoyouPage');
  }

  SureRemoveFrd(){
    let alert = this.alertCtrl.create();
    alert.setTitle('您确定要删除该好友吗？');
    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        console.log('Checkbox data:', data);

      }
    });
    alert.present();
  }
}
