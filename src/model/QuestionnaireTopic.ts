export interface QuestionnaireTopic{
  QTID:string; //试卷内容主键id
  QID:string; //试卷id
  BASETYPE:number; //试题类型
  BTXTITLE:string; //类型名称
  TOPIC:string; //试题内容
  TOPICCOUNT:number; //选项数
  PARENTID:string; //子题id
}
