/**
 * 給數組增加刪除元素方法（remove）
 * @param dx
 * @returns {*}
 */
Array.prototype.remove=function(dx)
{
  if(isNaN(dx)||dx>this.length){return false;}
  var obj;
  for(var i=0,n=0;i<this.length;i++)
  {
    if(this[i]!=this[dx])
    {
      this[n++]=this[i]
    }else{
      obj = this[i];
    }
  }
  this.length-=1
  return obj;
}
