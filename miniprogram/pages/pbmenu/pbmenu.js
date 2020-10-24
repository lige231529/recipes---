import DB from "../../utils/DB"
import {tables} from "../../utils/tables"
import {_upload} from "../../utils/fc"
Page({
  
  onLoad(){
    this.get()
    this.isVerify()
  },
  async isVerify(){
    let res =await DB._getOne('re-verify','d81cd5415f92e077019d748f241a6fc7')
    let isVerify=    res.data.isVerify==="0"?false:true
    this.setData({
      isVerify
    })
    
  },
  async get(){
    let recipeList = await DB._get(tables.typename,{status:"1"})
    //  console.log(recipeList);
     this.setData({
      recipeList:recipeList.data
     })
  },
  data:{
    files:[],//图片列表
    recipeList:[],//分类列表
    isVerify:false
  },
//事件1  图片选中后触发，在事件中得到所选图片的地址，处理成图片上传需要的格式，[{url:""}],由于一次可传多张，所以是一个数组
  imgselect(e){
    let files =  e.detail.tempFilePaths.map(item=>{
      return {url:item}
    })
    this.setData({
      files:this.data.files.concat(files) //防止覆盖，应该是累计
    })
  },
  imgdelete(e){
    console.log(e);
    let index = e.detail.index
    this.data.files.splice(index,1)
    
  },
  
   // 事件2  点击发布，触发提交
 async submit(e){
  
 let result =await _upload(this.data.files)
 let data=e.detail.value
 let images= result.map(item=>{
  return item.fileID
})
data.status="1"
 data.images= images
 data.viewnum=0
 data.lovenum=0
 data.addtime=new Date()
  DB._add(tables.recipename,data).then(res=>{
    if(res._id){
      wx.showToast({
        title:"发布成功",
        mask:true
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '/pages/personal/personal',
        })
      },1000)
    }
    
  })
  },
 
 
  
})