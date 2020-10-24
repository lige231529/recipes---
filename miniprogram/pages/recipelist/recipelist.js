import DB from "../../utils/DB"
import {tables} from "../../utils/tables"
Page({
  data:{
    typeid:"",
    recipelist:[],
    page:1,
    limit:5,
    isMore:false,
    typename:""
  },
  // 请求菜谱分类为儿童菜谱的的列表，查询条件为 id,status
  onLoad(options){
   let typeid = options.id
   let typename = options.typename
    this.setData({
      typeid,typename
    })
    this.getRecipeList()
  },
  
  // 获取某一分类的列表数据
async getRecipeList(){
  wx.setNavigationBarTitle({
    title: this.data.typename,
  })
if(this.data.isMore){
  return
}
  wx.showLoading({
    title: '加载中',
  })
    let typeid = this.data.typeid  //点击某个页面跳转传过来的分类名称
    let page = this.data.page
    let limit = this.data.limit 
    let result = await DB._get(tables.recipename,{typeid,status:"1"},page,limit,{field:"viewnum",order:"desc"})
    // console.log(result);
    if(result.data.length==0 || result.data.length<this.data.limit){
      this.setData({
        isMore:true
      })
    }
    wx.hideLoading()
   
    this.setData({
      recipelist:this.data.recipelist.concat(result.data)
    })
    if(this.data.recipelist.length===0){
      this.setData({
        isMore:false
      })
    }
    
  },
  onReachBottom(){
    console.log("到底了");
    this.data.page++
    this.getRecipeList()
  },
  goDetail(e){
    let {id,recipename,_id} = e.currentTarget.dataset
    wx.navigateTo({
      url:`/pages/recipeDetail/recipeDetail?id=${id}&recipename=${recipename}`,
    })
  }
})
