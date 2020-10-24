import DB from "../../utils/DB"
import {tables} from "../../utils/tables"
let db = wx.cloud.database()
Page({
  data:{
    typename:"",//分类名称，
    isadd:false,
    isedit:false,
    recipeList:[],
    _id:"",
    isVerify:false
  },
  // 绑定添加输入框input事件
  typeinput(e){
    // console.log(e.detail.value);
    this.data.typename = e.detail.value
  },
  // 1添加按钮，触发事件
 async add(){
   let typename = this.data.typename
 let result = await DB._add(tables.typename,{typename})
 if(result._id){
  wx.showToast({
    title:"添加成功"
  }),
  this.setData({
    typename:"",
    isadd:false
  })
}  
  },
  // 2 点击添加图标
  addicon(){
    this.setData({
      isadd:true
    })
  },
onLoad(){
this.isVerify()
 this.get()
  },
  async isVerify(){
    let res =await DB._getOne('re-verify','d81cd5415f92e077019d748f241a6fc7')
    let isVerify= res.data.isVerify==="0"?true:false
    this.setData({
      isVerify
    })
    
  },
 async get(){
    let recipeList = await DB._get(tables.typename,{status:"1"})
     this.setData({
      recipeList:recipeList.data
     })
  },
  //3 点击修改图标
 isedit(e){
   let {_id,typename} = e.currentTarget.dataset.item  
    this.setData({
      isedit:true,
      typename,
      _id
    })
  },
async  edit(){
  let typename= this.data.typename
  let result= await DB._update(tables.typename,this.data._id,{typename})
  if(result.stats.updated==1){
    wx.showToast({title:"修改成功"})
  }
  this.get()
  this.setData({
    isedit:false,
    typename:""
  })
  
  },
  async remove(e){
    let that = this
    let id = e.currentTarget.dataset.id 
    wx.showModal({
      title:"提示",
      content:"确认删除吗?",
      success(res){
        if(res.confirm){
           DB._remove(tables.typename,id).then(result=>{
            if(result.stats.removed==1){
              wx.showToast({
                title:"删除成功"
              })
              that.get()
      }
           })
         
        }
      }
    })
   
   
  }
  
})