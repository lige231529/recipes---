// 封装增删改查函数

let db= wx.cloud.database()
/**
 * 1 添加菜谱分类
 * @param {*} collection 表名字
 * @param {*} typename 菜谱分类名
 */
const _add=(collection,data={status:"1"})=>{
 return  db.collection(collection).add({
       data
     })
}
const _getOne=(collection,_id)=>{
  return db.collection(collection).doc(_id).get()
 }
const _get=(collection,where={},page=1,limit=5,orderby={field:"_id",order:"desc"})=>{
  let skip = (page-1)*limit
 return db.collection(collection).where(where).skip(skip).limit(limit).orderBy(orderby.field,orderby.order).get()
}
const _remove=(collection,id)=>{
  return db.collection(collection).doc(id).remove()
 }
const _update = (collection,id,data={})=>{
  return db.collection( collection ).doc( id ).update({data})
}
export default{
  _add,_get,_update,_getOne,_remove,db,_:db.command
}