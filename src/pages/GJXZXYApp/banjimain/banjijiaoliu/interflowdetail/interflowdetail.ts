import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the InterflowdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-interflowdetail',
  templateUrl: 'interflowdetail.html',
})
export class InterflowdetailPage {

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InterflowdetailPage');
  }

  showCheckbox() {
    let alert = this.alertCtrl.create();
    alert.setTitle('确定要退出该群聊吗？');



    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        console.log('Checkbox data:', data);
        // this.testCheckboxOpen = false;
        // this.testCheckboxResult = data;
      }
    });
    alert.present();
  }

}
