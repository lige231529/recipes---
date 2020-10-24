import DB from "../../utils/DB"
import {tables} from "../../utils/tables"
Page({
  data:{
    typelist:[],
    id:"",
    typename:"",
    keyword:""
  },
  onLoad(){
    this.getTypeList()
  },
  goPbmenutype(){
    wx.navigateTo({
      url: "/pages/pbmenutype/pbmenutype",
    })
  },
 async  getTypeList(){
  let result = await DB._get(tables.typename,{status:"1"},1,10)
  this.setData({
    typelist:result.data
  })
  
  },

  // 点击某一分类，去相应菜谱分类页，传入id,也就是分类页面的typeid
  goRecipeList(e){
    let {id,typename} = e.currentTarget.dataset   
   this.setData({
     id,typename
   })
   wx.navigateTo({
     url: `/pages/recipelist/recipelist?id=${id}&typename=${typename}`,
   })
  }
})