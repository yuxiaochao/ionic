import {Directive, TemplateRef,ElementRef, HostListener, Renderer,Input,ViewContainerRef} from '@angular/core';
/**
 * Generated class for the HighlightDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
//指令装饰器,每个指令都需要
@Directive({
  selector: '[slide]'
})
//指令类,这里类名是之前起的,不要管
export class HighlightDirective {
  //记录初始Y坐标的变量
  public OrClientY;
  //依赖注入,DOM对象,视图控制对象,视图对象
  constructor(elem: ElementRef,private viewContainer:ViewContainerRef,private templateRef:TemplateRef<any>) {
  }
  //输入装饰器,用来接收从组件中传来的属性,在模板中可以看到
  @Input('slide')
  //输入后用来执行的函数,主要逻辑在里面
  set ffff(direction:string){
    debugger
    let _this = this;
    //起始让up属性的容器显示
    if(direction=='up'){
      //渲染容器
      _this.viewContainer.createEmbeddedView(_this.templateRef);
    }
    //监听开始触碰,记录坐标Y
    document.addEventListener('touchstart', function(e: MouseEvent) {
      _this.OrClientY = event['targetTouches'][0].clientY
    });
    //监听触碰结尾
    document.addEventListener('touchend', function(e: MouseEvent) {
      if(event['changedTouches'][0].clientY>_this.OrClientY){
        //下滑,判定为下滑,页面一开一合
        if(direction=='up'){
          _this.viewContainer.createEmbeddedView(_this.templateRef);
        }if(direction=='down'){
          _this.viewContainer.clear();
        }

      }else if(event['changedTouches'][0].clientY<_this.OrClientY){
        //上滑
        if(direction=='down'){
          _this.viewContainer.createEmbeddedView(_this.templateRef);
        }if(direction=='up'){
          _this.viewContainer.clear();
        }
      }
    });
  }
}

