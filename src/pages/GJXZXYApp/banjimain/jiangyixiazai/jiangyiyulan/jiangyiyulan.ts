import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import {FileTransferObject} from "@ionic-native/file-transfer";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
/**
 * Generated class for the JiangyiyulanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-jiangyiyulan',
  templateUrl: 'jiangyiyulan.html',
})
export class JiangyiyulanPage {

  preview : any;
  fileTransfer: FileTransferObject = this.transfer.create();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private transfer: FileTransfer,
              private file: File,
              private fileOpener: FileOpener) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JiangyiyulanPage');
    this.preview=this.navParams.get('preview');
    console.log(this.preview)
  }

  downloads(){
    debugger
    //https://files-cdn.cnblogs.com/files/han-1034683568/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4Java%E5%BC%80%E5%8F%91%E6%89%8B%E5%86%8Cv1.2.0.pdf
    const url = 'https://files-cdn.cnblogs.com/files/han-1034683568/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4Java%E5%BC%80%E5%8F%91%E6%89%8B%E5%86%8Cv1.2.0.pdf';
    this.fileTransfer.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {
      console.log('下载地址1' + entry.toURL());
      console.log('下载地址2'+entry.nativeURL);
      console.log('下载地址3'+this.file.dataDirectory + 'file.pdf');



      this.fileOpener.open(entry.nativeURL, this.getFileMimeType('file.pdf'))
        .then(() =>
          console.log('下载完成 --------打开成功')
          )
        .catch(e =>
          console.log('下载完成--------打开失败', e)
        );

    }, (error) => {
      console.log("下载失败"+error)
    });

  }

  //获得Mime类型
  getFileMimeType(fileType: string): string {
    let mimeType: string = '';

    switch (fileType) {
      case 'txt':
        mimeType = 'text/plain';
        break;
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'doc':
        mimeType = 'application/msword';
        break;
      case 'pptx':
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      case 'ppt':
        mimeType = 'application/vnd.ms-powerpoint';
        break;
      case 'xlsx':
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'xls':
        mimeType = 'application/vnd.ms-excel';
        break;
      case 'zip':
        mimeType = 'application/x-zip-compressed';
        break;
      case 'rar':
        mimeType = 'application/octet-stream';
        break;
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      default:
        mimeType = 'application/' + fileType;
        break;
    }
    return mimeType;
  }
}
