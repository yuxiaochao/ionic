import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DrawbarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-drawbar',
  templateUrl: 'drawbar.html',
})
export class DrawbarPage {

  ruler: any=[];
  letter: string='A';
  treem:  number=0;
  arr:any =[{ss:'A'},{ss:'B'},{ss:'C'},{ss:'D'},{ss:'E'},{ss:'F'},{ss:'G'},{ss:'H'},{ss:'I'},{ss:'J'},{ss:'K'},{ss:'L'},{ss:'M'},{ss:'N'},{ss:'O'},{ss:'P'},{ss:'Q'},{ss:'R'},{ss:'S'},{ss:'T'},{ss:'U'},{ss:'V'},{ss:'W'},{ss:'X'},{ss:'Y'},{ss:'Z'},{ss:'#'},];


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DrawbarPage');
    this.rightbar();
  }

  rightbar(){

    this.ruler=this.arr;
    console.log(this.arr);
  }

  onoverdo(item){
    for(let i=0;i<this.arr.length;i++){
      this.arr[i].cur=0;
    }
    item.cur=1;
    this.letter=item;
    this.treem=1;
  }

  onoutdo(){
    setTimeout( this.treem=0,300)
  }

}
