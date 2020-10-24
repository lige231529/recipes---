import DB from "../../utils/DB"
import {tables} from "../../utils/tables"

Page({
  data:{
    id:"",//菜谱id  页面跳转时传参获得
    recipename:"",//菜谱名称  页面跳转时传参获得
    recipeinfo:{},//该条菜谱详细信息
    isFollow:false,
    followid:"",//关注表id
    _openid:"a2",
    userinfo:{}  //存放是哪个用户发布的
  },
  
  onLoad(options){
    let {id,recipename} = options
    this.setData({
      id,recipename
    }) 
  
   
    this.setData({
      id,recipename
    })
    this.getDetailInfo()
    wx.setNavigationBarTitle({
      title: recipename
    })
   
    this.currentuserFollow()
    this.setViewnum()
  },
  onShow(){
    let loginInfo = wx.getStorageSync('loginInfo')
    this.setData({
      _openid:loginInfo._openid
    })
    
  },
async  getDetailInfo(){
  wx.showLoading({
    title: "加载中~"
  })
  let id =this.data.id
  let result = await DB._getOne(tables.recipename,id)
  this.getUserinfo(result.data._openid)
  this.setData({
    recipeinfo:result.data
  })
  wx.hideLoading()
  },
  // 浏览量增加1，页面每访问一次，浏览量加一
 async setViewnum(){
   
     let id = this.data.id  
     let res=await DB._update(tables.recipename,id,{viewnum:DB._.inc(1)})
   },
  // 当前浏览菜单的用户（登录的用户）是否关注了此菜单，返回布尔值
  async currentuserFollow(){
    let _openid =wx.getStorageSync('loginInfo')._openid
    // let _openid= this.data.openid //后续会从缓存中获取，用户登录成功后，用户信息存在缓存中
    let recipeid = this.data.id  //当前菜单的id
    // 去关注表中查询是否有（条件：用户_openid && recipeid）
    let result =await DB._get(tables.follows,{_openid,recipeid})
    if(result.data.length>0){ //找到了，说明已关注
      this.setData({
        isFollow:true,
        followid:result.data[0]._id
      })
    }else{ //如果没找到，说明没关注
      this.setData({
        idFollow:false,
        followid:""
      })
    }
  },
 async follow(){
    let _id=this.data.followid
    let _openid=this.data._openid
    let recipeid= this.data.id
    // 只修改isFollow的话，刷新之后还是没有，所以还需修改数据库
    if(this.data.isFollow){//取消关注 
      let result= await DB._remove(tables.follows,_id)
      this.setData({
        isFollow:false
      })
      let res =await DB._update(tables.recipename,recipeid,{lovenum:DB._.inc(-1)})
      this.getDetailInfo()  
    }else{  
   let data= {
    _openid,recipeid
   }
let result= await DB._add(tables.follows,data)
// 根据关注表中的recipeid(是recipes表的_id),去更新recipes表的lovenum
this.setData({
  followid:result._id,
  isFollow:true
})
let res =await DB._update(tables.recipename,recipeid,{lovenum:DB._.inc(1)})
    }
    this.getDetailInfo()
  },
  async getUserinfo(_openid){
    let result = await DB._get(tables.users,{_openid},1,8)
    this.setData({
      userinfo:result.data[0].userinfo
    })  
  }
})