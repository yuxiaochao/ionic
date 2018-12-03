export interface ChatMessage {
  msgId:string;//id
  msg:any;//消息内容
  sendingTime?:string;//发送时间
  sendingDate?:string;//发送日期
  theFirst?:boolean;//当天第一条信息
  theLast?:boolean;//当天最后一条信息
  portrait?:string;//头像地址
  sex?:string;//男女
  type?:string;//消息是自己发的还是对方发的或者其他   me：自己   others：对方     system：系统通知    newFriend：新的好友通知     dangjianban：党建办通知
  from?:string;//来源(对象id)
  fromName?:string;//对象名称
  fromType?:string;//来源分类[chat单聊,group群组,room聊天室]
  userId?:string;//发信息用户Id（群用）
  userName?:string;//发信息用户名称（群用）
  userPortrait?:string;//发信息用户头像（群用）
  msgType?:string;//默认文本 txt：文本，img：图片，cmd：命令，file：文件，audio：音频，video：视频
  filepath?:any;//语音路径
}
