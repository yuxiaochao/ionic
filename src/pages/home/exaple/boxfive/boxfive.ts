import { Component , ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BoxfivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-boxfive',
  templateUrl: 'boxfive.html',
})
export class BoxfivePage {
  no : string = 'none' ;
  yes : string = 'block' ;

  @ViewChild('name1') name1: ElementRef;
  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BoxfivePage');
    this.run();
  }

  run(){
    if(this.name1.nativeElement.offsetHeight > 25 ){
       this.no='block';
       this.yes='none';
    } else {
      this.no='none';
      this.yes='block';
    }
  }

}
