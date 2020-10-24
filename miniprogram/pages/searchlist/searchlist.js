import DB from "../../utils/DB"
import {tables} from "../../utils/tables"
Page({
      data: {
        page: 1,
        limit: 10,
        keyword: "",
        isMore: false,
        recipelist:[]
      },
      // 请求菜谱分类为儿童菜谱的的列表，查询条件为 id,status
      onLoad(options) {
        let keyword = options.keyword
        this.setData({
          keyword
        })
        this.getRecipeList()
      },
      // 获取某一分类的列表数据
      async getRecipeList() {
        wx.setNavigationBarTitle({
          title: this.data.keyword + "搜索结果",
        })
        if (this.data.isMore) {
          return
        }
        wx.showLoading({
          title: '加载中',
        })
        // recipename:DB.db.RegExp({
        //   regexp:keyword,
        //   options:'i'
            let{page,limit,keyword} = this.data
            let result = await DB._get(tables.recipename,{
              recipename:DB.db.RegExp({
                regexp:keyword,
                options:"i"
              }),
              status:"1"}
              ,page,limit)
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