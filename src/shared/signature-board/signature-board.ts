import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-signature-board',
  templateUrl: 'signature-board.html',
})
export class SignatureBoardPage {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @ViewChild('contentEl',{ read: ElementRef }) contentEl: ElementRef;
  @ViewChild('ionHeaderEl',{ read: ElementRef }) ionHeaderEl: ElementRef;
  signaturePadOptions: Object = {
    'minWidth':1,
    'maxWidth':1
  };
  isMoon:boolean = false;
  moonClass:boolean;
  signatureImg:Array<any> = [];
  drawIndex:number = 0;
  undo_btn:boolean;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public storage:Storage) {
    if (this.navParams.data) {
      this.isMoon = this.navParams.data.isMoon;
    }
  }


  ionViewDidLoad() {
    this.signaturePad.set('canvasWidth', this.contentEl.nativeElement.clientWidth);
    this.signaturePad.set('canvasHeight',this.contentEl.nativeElement.clientHeight-this.ionHeaderEl.nativeElement.clientHeight);
    this.signaturePad.clear();
    if(this.navParams.data) {
      if(this.navParams.data.signatureImg.length > 0){
        this.signaturePad.fromData(this.navParams.data.signatureImg);
      }
    }

    if(this.isMoon){
      this.storage.get('test_seeting').then(data=>{
        if(data && data.nightModel){
          this.moonClass = true;
          //this.renderer.addClass(this.ionHeaderEl.nativeElement,'moon_test');
        }
      });
    }
    if(this.signaturePad.isEmpty())
      this.undo_btn = true;
  }

  drawStart() {
    if(this.signaturePad.isEmpty()){
      this.drawIndex = 0;
      this.signatureImg = [];
    }
  }

  drawComplete() {
    this.undo_btn = false;
  }

  undoSignature(){
    if(this.undo_btn){
      return false;
    }
    let data = this.signaturePad.toData();
    if (data) {
      this.drawIndex++;
      this.signatureImg.push(data.pop());
      this.signaturePad.fromData(data);
    }
    if(this.signaturePad.isEmpty())
      this.undo_btn = true;
  }

  restoreSignature(){
    if(this.drawIndex < 1){
      return;
    }
    let data = this.signaturePad.toData() || [];
    this.drawIndex--;
    data = data.concat(this.signatureImg.splice(this.drawIndex));
    this.signaturePad.fromData(data);
    this.undo_btn = false;
  }

  cleanSignature() {
    this.signaturePad.clear();
    this.undo_btn = true;
    this.drawIndex = 0;
    this.signatureImg = [];
  }
  closeSignatureBoard(){
    this.viewCtrl.dismiss({signatureImg:this.signaturePad.toData()});
  }

}
