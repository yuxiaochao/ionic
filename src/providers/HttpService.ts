import {Injectable} from '@angular/core';
import {
  HttpClient, HttpHeaders, HttpParams, HttpResponse,
} from '@angular/common/http';
import {Observable, TimeoutError} from "rxjs";
import {Utils} from "./Utils";
import {GlobalData} from "./GlobalData";
import {NativeService} from "./NativeService";
import {APP_SERVE_URL, REQUEST_TIMEOUT, IS_DEBUG} from "./Constants";
import {Logger} from "./Logger";
import { Storage } from "@ionic/storage"
import {App, NavController} from "ionic-angular";
import {MyApp} from "../app/app.component";

@Injectable()
export class HttpService{


  constructor(public globalData : GlobalData,
              public nativeService : NativeService,
              public http : HttpClient,
              public logger : Logger,
              public storage : Storage,
              public appCtrl : App){

  }
  private static METHOD_DELTE = 'DELETE';
  private static METHOD_POST = 'POST';
  private static METHOD_GET = 'GET';
  private static METHOD_PUT = 'PUT';
  private static METHOD_PATCH = 'PATCH';

  count: number = 0;//记录未完成的请求数量,当请求数为0关闭loading,当不为0显示loading

  /**
   * 格式化url使用默认API地址:APP_SERVE_URL
   */
  private formatUrlDefaultApi(url: string = ''): string {
    return Utils.formatUrl(url.startsWith('http') ? url : APP_SERVE_URL + url)
  }


  /**
   * 给请求头添加权限认证token
   */
  private addAuthorizationHeader(options: any): any {
    let token = this.globalData.token;
    if(token){
      if (options.headers) {
        options.headers = options.headers.set('Authorization', `Bearer ${token}`);
      } else {
        options.headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
      }
    }
    return options;
  }
  private showLoading() {
    //if (++this.count > 0) {//一旦有请求就弹出loading
      this.globalData.showLoading && this.nativeService.showLoading();
    //}
  }

  private hideLoading() {
    if (this.globalData.showLoading) {
      //延迟处理可以避免嵌套请求关闭了第一个loading,突然后弹出第二个loading情况(结合nativeService.showLoading())
      setTimeout(() => {
        //if (--this.count === 0) {//当正在请求数为0,关闭loading
          this.nativeService.hideLoading();
        //}
      }, 200);
    } else {
      this.globalData.showLoading = true;
    }
  }


  /**
   * 处理请求成功事件
   */
  requestSuccessHandle(url: string, options: any, json: HttpResponse<Object>) {
    this.hideLoading();
    if (url.indexOf(APP_SERVE_URL) != -1) {
      if (json['code'] != 200) {
        IS_DEBUG && console.log('%c 请求失败 %c', 'color:red', '', 'url', url, 'options', options, 'err', json);
        if (json['code'] == 401) {//401 token无效或过期需要重新登录
          this.storage.remove("token");
          this.nativeService.alert('密码已过期,请重新登录','','',(()=>{
            let activeNav: NavController[] = this.appCtrl.getActiveNavs();
            activeNav[0].push(MyApp);
          }));
        } else {
          this.nativeService.alert(json['errorMsg'] || '请求失败,请稍后再试!');
        }
        return {success: false, data: json['data']};
      } else {
        IS_DEBUG && console.log('%c 请求成功 %c', 'color:green', '', 'url', url, 'options', options, 'res', json);
        return {success: true, data: json['data']};
      }
    } else {
      return {success: true, data: json['data']};
    }
  }
  /**
   * 处理请求失败事件
   */
  private requestFailedHandle(url: string, options: any, err: HttpResponse<Object>) {
    IS_DEBUG && console.log('%c 请求失败 %c', 'color:red', '', 'url', url, 'options', options, 'err', err);
    this.hideLoading();
    if (!this.nativeService.isConnecting()) {
      this.nativeService.alert('请连接网络');
    } else if (err instanceof TimeoutError) {
      this.nativeService.alert('请求超时,请稍后再试!');
    } else {
      let status = err.status;
      let msg = '请求发生异常';
      if (status === 0) {
        msg = '请求失败，请求响应出错';
      } else if (status === 404) {
        msg = '请求失败，未找到请求地址';
      } else if (status === 500) {
        msg = '请求失败，服务器出错，请稍后再试';
      }else if(status === 401){
        msg = 'Token无效,请重新登陆!';
        this.storage.remove("token");
      }
      if(status === 401){
        this.nativeService.alert(msg,'','',(()=>{
          let activeNav: NavController[] = this.appCtrl.getActiveNavs();
          activeNav[0].push(MyApp);
        }));
      }else{
        this.nativeService.alert(msg);
      }

      this.logger.httpLog(err, msg, {
        url: url,
        status: status
      });
    }
    return err;
  }

  /**
   * 将对象转为查询参数
   */
  private static buildURLSearchParams(paramMap): HttpParams {
    let params = new HttpParams();
    if (!paramMap) {
      return params;
    }
    for (let key in paramMap) {
      let val = paramMap[key];
      if (val instanceof Date) {
        val = Utils.dateFormat(val, 'yyyy-MM-dd hh:mm:ss')
      }
      params = params.set(key, val);
    }
    return params;
  }

  public request(method : string, url: string, options: any = {}): Observable<Response> {
    url = this.formatUrlDefaultApi(url);
    if (url.indexOf(APP_SERVE_URL) != -1) {
      options = this.addAuthorizationHeader(options);
    }
    options.observable= "response";
    IS_DEBUG && console.log('%c 请求前 %c', 'color:blue', '', 'url', url, 'options', options );
    this.showLoading();
    return Observable.create(observer => {
      this.http.request(method,url, options).timeout(REQUEST_TIMEOUT).subscribe((res:any) => {
        let result = this.requestSuccessHandle(url, options, res);
        result.success ? observer.next(result.data) : observer.error(result.data);
      }, err => {
        observer.error(this.requestFailedHandle(url, options, err));
      });
    });
  }

  public get(url: string, params: any = null): Observable<any> {
    return this.request(HttpService.METHOD_GET,url, {
      params: params
    });
  }

  public post(url: string, body: any = {}): Observable<any> {
    return this.request(HttpService.METHOD_POST,url, {
      body: body,
      headers: new HttpHeaders().set('Content-Type', 'application/json; charset=UTF-8')
    });
  }

  public postFormData(url: string, paramMap: any = null): Observable<any> {
    return this.request(HttpService.METHOD_POST,url, {
      body: HttpService.buildURLSearchParams(paramMap).toString(),
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      })
    });
  }

  public put(url: string, body: any = {}): Observable<any> {
    return this.request(HttpService.METHOD_PUT,url, {
      body: body
    });
  }

  public delete(url: string, paramMap: any = null): Observable<any> {
    return this.request(HttpService.METHOD_DELTE,url, {
      params: HttpService.buildURLSearchParams(paramMap).toString()
    });
  }

  public patch(url: string, body: any = {}): Observable<any> {
    return this.request(HttpService.METHOD_PATCH,url, {
      body: body
    });
  }
}
