import {Injectable} from "@angular/core";
import {NativeService} from "./NativeService";
import {GlobalData,} from "./GlobalData";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {NoticeService} from "./NoticeService";


@Injectable()
export class SqliteService {
  database: SQLiteObject;
  //上传附件情况表 id、
  //url 上传服务url
  //上传文件路径
  // 上传附带的参数json格式
  // 上传状态0未上传或正在上传，1上传成功，2上传失败、
  // 上传失败次数、
  // 创建时间
  t_Uploading:string=`
    create table if not exists t_Uploading(
    ID INTEGER PRIMARY KEY AUTOINCREMENT, 
    URL01 VARCHAR(500),
    FILEPATH VARCHAR(500),
    PARAM01 VARCHAR(2000),
    STATUS01 VARCHAR(3),
    FAILNUM INTEGER,
    CREATETIME DATETIME
    )
  `;
  //上传作业项目图片表
  //JC300001 ：计划id
  //userid  ：人员ID
  //JC305001 ：流程id
  //JC309001 ：执行进度ID
  //JC105002 ：设备编码
  //JC309004 ：作业ID
  //JC305008 ：作业项步骤
  // 上传文件路径、
  // 上传名称、
  // t_UploadJobPicture:string=`
  //   create table if not exists t_UploadJobPicture(
  //   ID INTEGER PRIMARY KEY AUTOINCREMENT,
  //   JC300001 VARCHAR(36),
  //   USERID  VARCHAR(36),
  //   JC305001 VARCHAR(36),
  //   JC309001 VARCHAR(36),
  //   JC105002 VARCHAR(36),
  //   JC309004 VARCHAR(36),
  //   JC305008 VARCHAR(36),
  //   PATH01 VARCHAR(500),
  //   NAME01 VARCHAR(100)
  //   )
  // `;
  //插入上传附件情况表数据
  ins_t_Uploading:string=`
    INSERT INTO T_UPLOADING(URL01,FILEPATH,PARAM01,STATUS01,FAILNUM,CREATETIME)
    VALUES(?,?,?,0,0,datetime('now'))
  `;
  //插入上传作业项目图片表数据
  // ins_t_UploadJobPicture:string=`
  //   INSERT INTO t_UploadJobPicture(JC300001,USERID,JC305001,JC309001,JC105002,JC309004,JC305008,PATH01,NAME01)
  //   values(?,?,?,?,?,?,?,?,?)
  // `;
  //更新上传附件情况表数据
  upd_t_Uploading01:string=`
    UPDATE T_UPLOADING SET STATUS01 = ? WHERE ID = ?
  `;
  //更新上传附件情况表数据
  upd_t_Uploading02:string=`
    UPDATE T_UPLOADING SET STATUS01 = ?,FAILNUM = FAILNUM + 1 WHERE ID = ?
  `;
  //查询未上传情况
  sel_Uploading01:string=`
    select * from t_Uploading t 
    where t.STATUS01 in ('0','2') AND T.ID NOT IN ({{1}})
  `;
  //查询已完成的
  sel_Uploading02:string=`
    SELECT * FROM T_UPLOADING T WHERE T.STATUS01 = '1'
  `;
  //删除
  del_t_Uploading:string=`
    DELETE FROM T_UPLOADING T WHERE T.ID = ?
  `;
  //删除
  // del_t_UploadJobPicture:string=`
  //   delete from t_UploadJobPicture t where t.id = ?
  // `;
  constructor(private nativeService: NativeService,
              private globalData: GlobalData,
              private noticeSer: NoticeService,
              private sqlite: SQLite) {
    this.initDB();//初始化db
  }



  /**
   * 初始化数据库DB
   */
  initDB() {
    return new Promise((resolve, reject) => {
      if(!this.database){
        this.sqlite.create({
          name: 'data.db.bjdcd',//北京动车段
          location: 'default'
        }).then((db: SQLiteObject) => {
          //创建表
          db.executeSql(this.t_Uploading, [])
            .then(() => {
              //删除掉已经上传完的附件记录
              this.delete_Uploading().then(()=>{
              });
            })
            .catch(e => reject("initDB01 err:"+e));

          this.database = db;
        }).catch(e => reject("initDB02 err:"+e));
      }else{
        resolve();
      }
    });
  }

  /**
   * 插入上传附件情况表数据
   * @param {{TYPE01: number}} params
   * @returns {Promise<any>}
   */
  insert_t_Uploading(params:{url:string,filePath:string,fileParam:any}){
    return new Promise((resolve, reject) => {
      let filePath = "";
      if(params.filePath.constructor == Array){
        filePath = JSON.stringify(params.filePath);
      }else if(typeof params.filePath == "string"){
        filePath = params.filePath;
      }
      this.database.executeSql(this.ins_t_Uploading,
        [params.url,filePath,JSON.stringify(params.fileParam)])
        .then((r) => resolve(r))
        .catch(e => reject("insert_t_Uploading err:"+e));//插入数据
    });
  }

  /**
   * 插入上传作业项目图片表数据
   * @returns {Promise<any>}
   */
  // insert_t_UploadJobPicture(params:{JC300001:string,USERID:string,JC305001:string,JC309001:string,JC105002:string,JC309004:string,JC305008:string,PATH01:string,NAME01:string}){
  //   return new Promise((resolve, reject) => {
  //     this.database.executeSql(this.ins_t_UploadJobPicture,
  //       [params.JC300001,params.USERID,params.JC305001,params.JC309001,params.JC105002,params.JC309004,params.JC305008,params.PATH01,params.NAME01])
  //       .then((req) => resolve(req))
  //       .catch(e => reject("insert_t_UploadJobPicture err:"+e));//插入数据
  //   });
  // }

  //修改数据
  update_t_Uploading(params:{index:number,STATUS01:number,id:number}){
    return new Promise((resolve, reject) => {
      if(params.index == 1){
        this.database.executeSql(this.upd_t_Uploading01,
          [params.STATUS01,params.id])
          .then(() => {
            resolve();
          })
          .catch(e => reject("update_t_Uploading01 err:"+e));
      }else if(params.index == 2){
        this.database.executeSql(this.upd_t_Uploading02,
          [params.STATUS01,params.id])
          .then(() => resolve())
          .catch(e => reject("update_t_Uploading02 err:"+e));
      }
    });
  }

  /**
   * 查询
   * @param UploadingId排除掉正在上传或在队列中的附件
   */
  query(param:{UploadingId:Array<any>}) {
    return new Promise((resolve, reject) => {
      let placeholder01 = "";
      for(let thisUpId of param.UploadingId){
        placeholder01 += "?,";
      }
      placeholder01 += "?";
      param.UploadingId.push({id:"-1"});
      this.database.executeSql(this.sel_Uploading01.replace("{{1}}",placeholder01),
        param.UploadingId["id"]).then((data)=>{
        // alert(data.rows.length);
        //alert(data.rows.item(0).name);
        resolve(data.rows);
      },(error)=>{
        console.log('查询错误');
        reject("query err:"+error);
      });
    });
  }
  //删除
  delete_Uploading(){
    return new Promise((resolve, reject) => {
      this.database.executeSql(this.sel_Uploading02,
        []).then((data)=>{
        for(let i=0;i<data.rows.length;i++){
          let UploadingId = data.rows.item(i).ID;
          let key01 = data.rows.item(i).KEY01;
          this.database.executeSql(this.del_t_Uploading,
            [UploadingId]).then((data)=>{
            resolve();
          },(error)=>{
            console.log('错误');
            reject("delete_Uploading err01:"+error);
          });
        }
      },(error)=>{
        console.log('查询错误');
        reject("delete_Uploading err03:"+error);
      });
    });
  }

}
