/**
 * 自己课程学习的实时情况信息(缓存)
 */
export interface OneselfCourseLearnInfo {
  courseId:string;
  coursewareId:string;
  userId:string;
  cwPlayPosition?:string;//课件播放位置
  isUpload:boolean;//是否同步服务器
  cwProgress:string;//课件进度
  isLearnFinishCw:boolean;//当前课件是否学习完毕
  cwPageCurrNum?:number;//当前课件页下标（仅文档课件）
  isPass:number;//当前课程是否结业 0 未结业 1、已结业 2、强制结业
  cTime:number;//记录时间戳
}
