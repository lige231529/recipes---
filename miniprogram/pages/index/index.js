import DB from "../../utils/DB"
import {
  tables
} from "../../utils/tables"
Page({
  data: {
    typename: "热门菜谱",
    viewList: [], //此数组中的详情信息，需要加入发布者的信息（请求到列表信息后，遍历列表，根据_openid去users表中查询，查到userinfo字段）
    keyword:"",
  },
  inputkeyword(e){
      this.setData({
        keyword:e.detail.value
      })
  },
  goSearch(){
      let keyword = this.data.keyword
      wx.navigateTo({
        url: `/pages/searchlist/searchlist?keyword=${keyword}`,
      })
  },
  onLoad() {
    this.getViewList()
    this.setData({
      keyword:""
    })
  },
  // 推荐菜谱数据
  async getViewList(){
    wx.showLoading({
      title: '加载中~',
    })
    let result = await DB._get(tables.recipename, {
      status: "1"
    }, 1, 8, {
      field: "viewnum",
      order: "desc"
    })
    //  console.log(result.data);
    // ---------------------------------------------------------
    let userPros = []
    result.data.forEach((item) => {
      let _openid = item._openid
      let userPro = DB._get(tables.users, {
        _openid
      })
      userPros.push(userPro)
    })
    let usersInfo = await Promise.all(userPros)
    result.data.forEach((item, index) => {
      item.userInfo = usersInfo[index].data[0].userInfo
    })
    this.setData({
      viewList: result.data
    })
    wx.hideLoading()
    //  -----------------------------------------------------------------------
  },
  async getRecipeList(id) {
    let result = await DB._get(tables.recipename, {
      typeid: id,
      status: "1"
    }, 1, 8)
    let userPros = []
    result.data.forEach((item) => {
      let _openid = item._openid
      let userPro = DB._get(tables.users, {
        _openid
      })
      userPros.push(userPro)
    })
    let usersInfo = await Promise.all(userPros)
    result.data.forEach((item, index) => {
      item.userinfo = usersInfo[index].data[0].userinfo
    })
    this.setData({
      viewList: result.data
    })

  },
  goTypeList() {
    wx.navigateTo({
      url: '/pages/typelist/typelist',
    })
  },
  typechange(e) {
    let {
      id,
      typename
    } = e.currentTarget.dataset
    this.setData({
      id,
      typename
    })
    this.getRecipeList(this.data.id)
  },

  goRecipeList(e) {
  
    let typename = e.currentTarget.dataset.typename
    let id = ""
    switch (typename) {
      case "儿童菜谱":
        id = "c54bd3a25f8831410148c228768913ab"
        break;
      case "养生菜谱":
        id = "8e5be7055f88352b01ceadaa720c96e6"
        break;
      case "推荐菜谱":
        id = "e656fa635f88329a019437694a0fd9ca"
        break;
      default:
        break;
    }
    wx.navigateTo({
      url: `/pages/recipelist/recipelist?typeid=${id}&typename=${typename}`,
    })
  },
  goDetail(e) {
    let {
      id,
      recipename,
      _id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/recipeDetail/recipeDetail?id=${id}&recipename=${recipename}`,
    })

  }


})