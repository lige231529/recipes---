import DB from "../../utils/DB"
import {
  tables
} from "../../utils/tables"

Page({
  data: {
    isLogin: false,
    userInfo: {}, //当前用户的信息
    _openid: "",
    pbRelist: [], //当前用户发布的菜谱列表
    tab: "0",
    followsList: [], //关注列表
    TypeList: [], //用户发布的菜单分类
    moreList: [], //左滑更多
  },
  goDetail(e) {
    let {
      id,
      recipename
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/recipeDetail/recipeDetail?id=${id}&recipename=${recipename}`,
    })
  },
  // 左滑更多，点击查看跳到详情页
  async goTypeList(e) {
    console.log(e.currentTarget.dataset.id);
    let typeid = e.currentTarget.dataset.id
    let typename = e.currentTarget.dataset.typename
    wx.navigateTo({
      url: `/pages/recipelist/recipelist?id=${typeid}&typename=${typename}`,
    })

  },
  onLoad() {
    this.isUserLogin()
    //   this.getFollowList()//临时
    //  this.getTypeList() 
    
  },
  
  pbmenu() {
    wx.navigateTo({
      url: '/pages/pbmenu/pbmenu',
    })
  },
  _doLogin(e) {
//  console.log(e);
//  return
    // 1 点击登录按钮，弹出是否登录弹框（允许 或者 拒绝）
    if (e.detail.userInfo) { 
      let userInfo = e.detail.userInfo
      // 允许登录了，获取用户信息
      this.setData({
        userInfo
      })  
    let _this = this 
    wx.login({
      async success() {
        let openidinfo = await wx.cloud.callFunction({
          name: "dologin"
        })
        let _openid = openidinfo.result.openid
        // console.log(_openid)
        // 根据得到的_openid 查询用户列表
        let userRes = await DB._get(tables.users, {
          _openid
        })    
        // console.log(userRes); // 用户表中的用户_id
        let userid = ""
        let userInfo = _this.data.userInfo
        if (userRes.data.length > 0) { //说明找到了，说明已经注册过了，
          userid= userRes.data[0]._id
          let res = await DB._update(tables.users, userid, {
            userInfo
          })
        } else { //如果没找到，相当于注册，直接将用户信息添加到数据库，同时登陆   
          let res = await DB._add(tables.users, {
            userInfo 
          })
          userid = res._id  
           }
        let loginInfo = {
          userid,
          _openid,
          userInfo
        }
        wx.setStorageSync('loginInfo', loginInfo)
        _this.setData({
          isLogin: true,
        })
        _this.getPbRelist()
      }
    })
    }else{
      wx.showToast({
        title: '登录才能看到更多内容哦~',
        icon: "none",
        mask: true
      })
    }

   
  },
  // 判断当前用户是否登录了，上面的登录逻辑中，登陆之后，存到了缓存中
  async isUserLogin() { //页面加载就调用
    let loginInfo = wx.getStorageSync('loginInfo') || {}
    // console.log(loginInfo);
    if (loginInfo.userid) {
      let userInfo = loginInfo.userInfo
      let _openid = loginInfo._openid
      this.setData({
        _openid,
        userInfo,
        isLogin: true
      })
      console.log(this.data._openid);

      this.getPbRelist()
    }

  },
  async getPbRelist() {
    let loginInfo = wx.getStorageSync('loginInfo')
    let _openid = loginInfo._openid
    let res = await DB._get(tables.recipename, {
      _openid,
      status: "1",
    })
    this.setData({
      pbRelist: res.data
    })
    // console.log(this.data.pbRelist);

  },
  tabchange(e) {
    let tab = e.currentTarget.dataset.tab
    // console.log(tab);

    switch (tab) {
      case "0":
        this.getPbRelist()
        break;
      case "1":
        this.getTypeList()
        break;
      case "2":
        this.getFollowList()
        break;
      default:
        break;
    }
    this.setData({
      tab
    })
  },
  // 用户关注的菜谱
  // 思路：先根据_openid查询用户关注表，得到recipeid,用此id去获取菜谱表，通过id查询到的异步结果重新组成新数组
  async getFollowList() {
    wx.showLoading({
      title: "拼命加载中~",
    })
    let _openid = this.data._openid
    let res = await DB._get(tables.follows, {
      _openid
    }, 1, 10)
    let pros = []
    res.data.forEach((item) => {
      let _id = item.recipeid
      let pro = DB._getOne(tables.recipename, _id)
      pros.push(pro)
    })
    let list = await Promise.all(pros)
    let followsList = []
    list.forEach(item => {
      return followsList.push(item.data)
    })
    this.setData({
      followsList
    })
    wx.hideLoading()
  },
  // 获取菜谱分类列表
  // 思路：根据openid,查recipes表，再根据typeid查分类表
  async getTypeList() {
    let loginInfo = wx.getStorageSync('loginInfo')
    let _openid = loginInfo._openid
    let res = await DB._get(tables.recipename, {
      _openid
    }, 1, 10)
    let pros = []
    let typeids = []
    res.data.forEach(item => {
      typeids.push(item.typeid)
    })
    let newtypeids = [...new Set(typeids)]
    // console.log(newtypeids);
    newtypeids.splice(2, 1)
    newtypeids.forEach(item => {
      let pro = DB._getOne(tables.typename, item)
      pros.push(pro)
    })
    let list = await Promise.all(pros)


    let typeList = []
    list.forEach(item => {
      typeList.push(item.data)
    })
    this.setData({
      typeList
    })
    // console.log(this.data.typeList);

  },
 async delPb(e) {
    let _id = e.currentTarget.dataset.id
    DB._remove(tables.recipename, _id)
    this.getPbRelist()
    this.getTypeList()
  }
})