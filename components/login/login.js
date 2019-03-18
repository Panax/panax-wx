// components/login/login.js
var app = getApp();
import http from '../../dian/index';
// import time from '../../utils/util.js';


Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持,
  },



  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isShow:true
  },
  ready (){

  },
  methods:{
    onLoad() {

    },
  

    //登录
    login(userinfo) {
      let that = this;
      wx.showLoading({
        title: '登录中',
      })
      wx.checkSession({
        success: function (res) {
          console.log(res)
          //session_key 未过期，并且在本生命周期一直有效
          wx.login({
            success: function (res) {
              // console.log(res.code)
              http.request({
                url: '/xcx/login/goWebchat',
                method: "GET",
                data: {
                  xcxflag: "zwx",
                  userInfo: userinfo,
                  code: res.code,
                },
                success: function (res) {
                  console.log(res)
                  //存储用户信息
                  wx.setStorageSync('userInfo', res.data.data.userInfo);
                  wx.setStorageSync('DIAN_TOKEN', res.data.data.token);
                  that.setData({
                    isShow: false
                  })
                  wx.hideLoading()
                },
              })
            }
          })
        },
        fail: function (res) {
          console.log(res)
          wx.login({
            success: function (res) {
              console.log(res.code)
              http.request({
                url: '/xcx/login/goWebchat',
                method: "GET",
                data: {
                  xcxflag: "zwx",
                  userInfo: userinfo,
                  code: res.code,
                },
                success: function (res) {
                  console.log(res)
                  //存储用户信息
                  wx.setStorageSync('userInfo', res.data.data.userInfo);
                  wx.setStorageSync('DIAN_TOKEN', res.data.data.token);
                  that.setData({
                    isShow: false
                  })
                },
              })
            }
          })
  }
})
   
    },

    //调起授权按钮
    bindGetUserInfo(e) {
      let that = this
      if (e.detail.userInfo) {
        //console.log(e.detail)
        //用户按了允许授权按钮
        // wx.setStorage({
        //   key: 'userInfo',
        //   data: e.detail.userInfo,
        // })

        wx.getUserInfo({
          withCredentials: true,
          success: function (res) {
            console.log("getUserInfo success...")
            console.log(res)
            //resolve(res);
            // wx.setStorageSync('userInfo', res.userInfo);
            that.login(res);
          },
          fail: function (err) {
            console.log("getUserInfo fail...")
            // reject(err);
          }
        })
      } else {
        wx.showModal({
          title: '警告通知',
          content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                      success: function (res) {
                        // wx.setStorageSync("userInfo", res);
                        that.login(res);
                      },
                    })
                  }
                }
              })
            }
          }
        });
        //用户按了拒绝按钮
      }
    },

   }

})
