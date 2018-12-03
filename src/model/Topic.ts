export interface Topic{
  ID:string; //试卷内容主键id
  TPID:string; //试卷id
  TOPICID:string; //试题id
  BASETYPE:number; //试题类型
  BTXTITLE:string; //类型名称
  TTOP008:string; //知识点
  TOPIC:string; //试题内容
  TOPICMARK:number; //试题分数
  TOPICCOUNT:number; //选项数
  TOPICOPTION:string; //题目选项
  TOPICK:string; //k值
  TTOP021:string; //主观题答案
  TTOP021K:string; //主观题（填空题）分割后答案
  TOPICKEY:string; //客观题标准答案
  TOPREMARK:string; //	题解
  PARENTID:string; //子题id
}
