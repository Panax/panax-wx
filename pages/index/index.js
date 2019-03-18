//index.js
import http from '../../dian/index';
//获取应用实例
const app = getApp()

Page({
  data: {
    loginIsShow: false,
    toView:'top',
    scrollTop:0,
    num:'',
    name:''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getNum();
    let that = this;
    let userinfo = wx.getStorageSync("userInfo");
    console.log(userinfo)
    if (userinfo) {
      that.setData({
        loginIsShow: false,
        name: userinfo.nickname
      })
    } else {
      that.setData({
        loginIsShow: true
      })
    }
  },
  onShow:function(){
    this.getNum();
    let that = this;
    let toke = wx.getStorageSync("DIAN_TOKEN")
    if (toke) {
      that.setData({
        loginIsShow: false
      })
    } else {
      that.setData({
        loginIsShow: true
      })
    }
  },
  onShareAppMessage: function () {
    let name = this.data.name
    return {
      title: name +  " 邀请你围观",
      path: 'pages/index/index',
      imageUrl: "../../imgs/shareImg.jpg"
    }
  },
  getNum(){
    let that = this;
    // console.log(11)
    http.request({
      url: 'xcx/question/front/getAllUserCount',
      method:"POST",
      data:{},
      success:function(res){
        console.log(res)
        that.setData({
          num:res.data.data
        })
      }
    })
  },
  //
  submit(e){
    // console.log(e.detail.formId)
    let formId = e.detail.formId
    wx.navigateTo({
      url: '/pages/logs/logs?formId=' + formId,
    })
  },
  //help
  tohelp(){
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },

  toViewid(){
    this.setData({
      toView:'bottom',
      scrollTop: 100
    })
  },
  // upper: function (e) {
  //   console.log(e)
  // },
  // lower: function (e) {
  //   console.log(e)
  // },
  scroll: function (e) {
    // console.log(e)
  },
  // toquestion(){
  //   wx.navigateTo({
  //     url: '/pages/answer/reply?questionID=469',
  //   })
  // }
})
