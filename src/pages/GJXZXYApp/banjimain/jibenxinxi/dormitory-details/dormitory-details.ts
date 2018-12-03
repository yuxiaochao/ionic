import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DormitoryDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dormitory-details',
  templateUrl: 'dormitory-details.html',
})
export class DormitoryDetailsPage {

  DORMITORY:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DormitoryDetailsPage');
    this.DORMITORY=this.navParams.get("DORMITORY");
    this.DORMITORY=this.DORMITORY[0];
  }

}
