import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Observable} from "rxjs";
import {NativeService} from "../../providers/NativeService";

/**
 * Generated class for the GaodeMapTestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gaode-map-test',
  templateUrl: 'gaode-map-test.html',
})
export class GaodeMapTestPage {
  BLongitude: number;
  BLatitude: number;
  longitude: number = 116.336033;//经度
  latitude: number = 39.978017;//纬度
  marker: any;//标记
  Bmarker: any;//基础标记
  circle: any;//周围圆圈
  accuracy: number;//精度
  map: any;
  placeSearch: any;//构造地点查询类
  infoWindow: any;
  istype: boolean = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public nativeService: NativeService,
              public loadingCtrl: LoadingController,) {
  }

  ionViewDidLoad() {
    if (this.navParams.get("BLongitude") != '' && this.navParams.get("BLongitude") != undefined) {
      //基础坐标
      this.BLongitude = this.navParams.get("BLongitude");
      this.BLatitude = this.navParams.get("BLatitude");
      //定位坐标
      this.longitude = this.navParams.get("Longitude");
      this.latitude = this.navParams.get("Latitude");
      this.accuracy = this.navParams.get("Accuracy");
      //设置定位点
      this.marker = this.creatMarker(this.longitude, this.latitude);
      //设置基础点
      this.Bmarker = this.creatMarker(this.BLongitude, this.BLatitude, './././assets/imgs/mark_r.png');
      //设置精确圈
      this.circle = this.creatCircle(this.BLongitude, this.BLatitude, this.accuracy);
      this.initMap();
      //this.initListener();
      this.map.on('complete', () => {
        this.map.add(this.marker);
        if (this.istype) {
          this.map.add(this.Bmarker);
          this.map.add(this.circle);
        }
        this.map.setFitView();
        console.log("地图加载完成！")
      });
    } else {
      //初始化定位
      this.initPositioning();
    }

  }

  initMap() {
    this.placeSearch = new AMap.PlaceSearch();//构造地点查询类
    this.infoWindow = new AMap.AdvancedInfoWindow({});
    this.map = new AMap.Map('container', {
      resizeEnable: true,
      center: [this.longitude, this.latitude],
      zoom: 11
    });
    AMap.plugin('AMap.ToolBar', () => {
      let toolbar = new AMap.ToolBar();
      this.map.addControl(toolbar);
    });
  }

  initListener() {
    let thiss = this;
    //为地图注册click事件获取鼠标点击出的经纬度坐标
    this.map.on('click', (e) => {
      this.map.remove(this.marker);
      this.longitude = e.lnglat.getLng();
      this.latitude = e.lnglat.getLat();
      this.marker = this.creatMarker(e.lnglat.getLng(), e.lnglat.getLat());
      this.map.add(this.marker);
      this.map.setFitView();
      console.log('当前坐标：' + e.lnglat.getLng() + ',' + e.lnglat.getLat());
    });
    //鼠标移入监听
    this.map.on('hotspotover', (result) => {
      this.placeSearch.getDetails(result.id, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          thiss.placeSearch_CallBack(result);
        }
      });
    });
  }

  creatMarker(longitude, latitude, imgPath?: string) {
    if (imgPath == undefined || imgPath == '' || imgPath == null) {
      imgPath = './././assets/imgs/mark_b.png';
    }
    // 构造点标记
    return new AMap.Marker({
      icon: imgPath,
      position: [longitude, latitude]
    });
  }

  creatCircle(longitude, latitude, radius?: number) {
    if (radius == undefined || radius == null) {
      radius = 1000;
    }
    // 构造矢量圆形
    return new AMap.Circle({
      center: new AMap.LngLat(longitude, latitude), // 圆心位置
      radius: radius,  //半径
      strokeColor: "#F33",  //线颜色
      strokeOpacity: 1,  //线透明度
      strokeWeight: 3,  //线粗细度
      fillColor: "#ee2200",  //填充颜色
      fillOpacity: 0.35 //填充透明度
    });
  }

  //回调函数
  placeSearch_CallBack(data) { //infoWindow.open(map, result.lnglat);
    var poiArr = data.poiList.pois;
    var location = poiArr[0].location;
    this.infoWindow.setContent(this.createContent(poiArr[0]));
    this.infoWindow.open(this.map, location);
  }

  createContent(poi) {  //信息窗体内容
    var s = [];
    s.push('<div class="info-title">' + poi.name + '</div><div class="info-content">' + "地址：" + poi.address);
    s.push("电话：" + poi.tel);
    s.push("类型：" + poi.type);
    s.push('<div>');
    return s.join("<br>");
  }

  initPositioning() {
    let loading = this.loadingCtrl.create({
      content: '等待定位...'//设置loading时显示的文字
    });
    loading.present();
    Observable.zip(this.nativeService.assertLocationService(), this.nativeService.assertLocationAuthorization()).subscribe(() => {
      GaoDe.getCurrentPosition((r) => {
        loading.dismiss();
        let latitude = r["latitude"];//纬度
        let longitude = r["longitude"];//经度
        //判断是否成功定位
        if (latitude != undefined) {
          this.longitude = longitude;
          this.latitude = latitude;
          //设置定位点
          this.marker = this.creatMarker(longitude,latitude);
          this.istype = false;
          this.initMap();
          //this.initListener();
          this.map.on('complete', () => {
            this.map.add(this.marker);
            if (this.istype) {
              this.map.add(this.Bmarker);
              this.map.add(this.circle);
            }
            this.map.setFitView();
            console.log("地图加载完成！")
          });
        } else {
          return this.nativeService.alert("当前定位失败！请稍后重试");
        }
      }, (e) => {
        console.log('Location err:' + e);
        return this.nativeService.alert("定位失败！请稍后重试");
      });
    }, () => {
      loading.dismiss();
      return this.nativeService.alert("初始化定位失败！请稍后重试");
    });
  }

}
