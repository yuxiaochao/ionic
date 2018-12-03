import {Directive, ElementRef, Input, OnChanges} from '@angular/core';
import {Topic} from "../../model/Topic";
import {Storage} from "@ionic/storage";
import {Utils} from "../../providers/Utils";

@Directive({
  selector: '[subTopic]' // Attribute selector
})
export class SubTopicDirective implements OnChanges{

  @Input('subTopic')topic:Topic;
  @Input()answer_key:string;
  @Input()disabled:boolean;
  @Input()way:string;

  answer_object:any;
  constructor(private elementRef:ElementRef,
              private storage:Storage) {
  }

  ngOnChanges(value) {
    if(value.disabled){
      if(value.disabled.currentValue && !value.disabled.previousValue){//当前试题已答将不允许在答题
        this.readonlyAnswer(true);
      }
    }

    if(value.way){
      if(value.way.currentValue == 'back'){
        this.readonlyAnswer(true);
      }else if(value.way.currentValue == 'answer'){
        this.storage.get(this.answer_key).then(data=>{
          this.answer_object = data || {};
          let answerResult = this.answer_object["answer_result_"+this.topic.ID];
          if(!answerResult){
            this.readonlyAnswer(false);
          }
        });
      }
    }



  }

  //禁用填空题不能填写答案
  readonlyAnswer(flag){
    let answer_input = this.elementRef.nativeElement.querySelectorAll('.answer_input');
    if(answer_input){
      answer_input.forEach(function (input,index) {
        input.readOnly = flag;
      });
    }
  }


  ngAfterViewInit(){
    let thiss = this;
    let answer_input = this.elementRef.nativeElement.querySelectorAll('.answer_input');
    if(answer_input){
      this.storage.get(this.answer_key).then(data=>{//获取缓存数据
        this.answer_object = data || {};
        let answer = this.answer_object["topicId_"+this.topic.ID];
        answer_input.forEach(function (input,index) {

          input.addEventListener('blur',()=>{
            thiss.answer_gap(answer_input);
          });
          if(Utils.isNotEmpty(answer)){
            input.value = answer.split('$$')[index];
          }
          /*input.addEventListener('keypress',()=>{
            let length = Utils.strLength(input.value)*5;
            if(length > inputWidth){
              input.style.width = length +"px";
            }
          })*/
        })

      });
    }
  }

  answer_gap(answer_input){
    let answer="";
    let dou="";
    this.storage.get(this.answer_key).then(data=>{//获取缓存数据
      this.answer_object = data || {};
      answer_input.forEach(function (input) {
        if(Utils.isNotEmpty(input.value)){
          answer +=dou+input.value;
        }else{
          answer +=dou+"";
        }
        dou = "$$";
      });
      this.answer_object['topicId_'+this.topic.ID] = answer;
      this.storage.set(this.answer_key,this.answer_object);
    })
  }


}
