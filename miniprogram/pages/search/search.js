import DB from "../../utils/DB"
import {
  tables
} from "../../utils/tables"
Page({
  data: {
    keyword: "",
    historyKeywords:[]
  },
  // input输入框事件
  input_keyword(e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  // 点击搜索事件
  async toSearch() {
    let keyword = this.data.keyword
    // 获得到搜索的关键词  1 去请求列表   2 存入到缓存中
    // --------------------存储关键字，用于近期搜索---------------------
    let keywords = wx.getStorageSync('keywords') || []
    let index = keywords.findIndex(item => keyword === item)
    if (index !== -1) { //说明找到了，删除，再添加到最前面
      keywords.splice(index, 1)
    } 
    keywords.unshift(keyword)
    wx.setStorageSync('keywords', keywords)
    // -----------------------------------------------------------------
    // 正则实现模糊匹配
    let res = await DB._get(tables.recipename, {
      recipename: DB.db.RegExp({
        regexp: keyword,
        option: "i"
      })
    })
    wx.navigateTo({
      url: `/pages/searchlist/searchlist?keyword=${keyword}`,
    })
    this.setData({
      keyword:""
    })
    // 点击搜索，此次搜索关键字，立马显示在近期搜索列表
    this.getHistoryKeywords()
    // console.log(res.data)  搜索关键字展示出来的菜谱组成的数组
  },
  // 获取近期搜索关键字
  getHistoryKeywords(){
    let keywords=  wx.getStorageSync('keywords')
    this.setData({
      historyKeywords:keywords
    })
    console.log(this.data.historyKeywords);
    
  },
  onShow(){
    this.getHistoryKeywords()
  },
  // 点击近期搜索关键字，跳到分类页
  goKeyword(e){
    let keyword = e.currentTarget.dataset.keyword
    wx.navigateTo({
      url: `/pages/searchlist/searchlist?keyword=${keyword}`,
    })
    
  }
})