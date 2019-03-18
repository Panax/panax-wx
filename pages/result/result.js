// pages/result/result.js
import http from '../../dian/index';
import formatTime from '../../utils/util.js';
var wxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      id:'',
      detail:{},
      sure:50.0,
      nosure:50.0,
      long1:347,
      long2:347,
      i:1,
      j:1,
      content:'',
      lsitCSComment:[],
      inputShow:false,
      click:false,
      click1:false,
      clickshow:true,
      clickshow1:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    that.setData({
      id:options.id
    })
    that.getDetail();
    that.getComment(); 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

 //获取数据
  getDetail(){
    let that = this;
    let id = that.data.id;
    http.request({
      url:'xcx/question/front/banner/getOneBanner',
      method:"POST",
      data:{
        id:id
      },
      success:function(res){
        let video_context_html = res.data.data.content;
        let html = video_context_html.replace(/<o:p><\/o:p>/g, '')
        // console.log(html)
        let contentData =
          `<html>
              <body>
                ${html}
              </body>
            </html>`
        wxParse.wxParse('article', 'html', contentData, that, 2)
        console.log(res)
        let detail = res.data.data;
        if (detail.click == true){
          if (detail.type == 1){
            that.setData({
              clickshow:false,
              click1:true
            })
          } else if (detail.type == 2){
            that.setData({
              clickshow1: false,
              click:true
            })
          }
        }
        let i = detail.helpnumber;
        let j = detail.nohelpnumber;
        let sure = (i / (i + j) * 100).toFixed(1);
        // console.log(sure);
        let nosure = (100 - sure).toFixed(1);
        // console.log(nosure)
        let long1 = 6.94 * sure
        // console.log(long1);
        let long2 = 6.94 * nosure
        that.setData({
          detail: detail,
          i:i,
          j:j,
          sure:sure,
          nosure: nosure,
          long1: long1,
          long2: long2
        })
      }
    })
  },
  //range
  yes(e){
    // console.log(e.currentTarget.dataset.id);
    let that = this;
    let detail = this.data.detail;
    let click = this.data.detail.click;
    let help = e.currentTarget.dataset.id;
    let pkid = this.data.id;
    let i = this.data.i;
    let j = this.data.j;
    let sure = this.data.sure;
    let nosure = this.data.nosure;
    let long1 = this.data.long1;
    let long2 = this.data.long2;
    if (click == false){
      detail.click = true;
      http.request({
        url: 'xcx/question/front/banner/addBannerHelpNumber',
        method: "POST",
        data: {
          pkid: pkid,
          type: help
        },
        success: function (res) {
          console.log(res)
        }
      })
      if (help == 1) {
        i += 1;
        that.setData({
          i: i,
          click1:true,
          clickshow:false
        })
   
      } else if (help == 2) {
        j += 1;
        that.setData({
          j: j,
          click:true,
          clickshow1: false
        })
 
      }
      sure = (i / (i + j) * 100).toFixed(1);
      // console.log(sure);
      nosure = (100 - sure).toFixed(1);
      // console.log(nosure)
      long1 = 6.94 * sure
      // console.log(long1);
      long2 = 6.94 * nosure
      // console.log(long2)
      that.setData({
        sure: sure,
        nosure: nosure,
        long1: long1,
        long2: long2,
        detail:detail
      })
    }
  },


//获取评论
getComment(){
  let that = this;
  let id = that.data.id;
  http.request({
    url:'xcx/question/front/comment/getCommentList',
    method:"POST",
    data:{
      pageIndex:1,
      pageSize:10,
      pkid:id
    },
    success:function(res){
      console.log(res)
      that.setData({
        lsitCSComment:res.data.data
      })
    }
  })
},


//获取评论
  getValue(e){
    let that = this;
    let content = e.detail.value;
    console.log(content)
    that.setData({
      content: content
    })
  },
//提交评论
  sendComment(){
    let that = this;
    let id = that.data.id;
    let content = that.data.content;
    if (content === ''){
      wx.showToast({
        title: '评论不能为空',
      })
      return;
    }
    let lsitCSComment = that.data.lsitCSComment;
    http.request({
      url:'xcx/question/front/comment/saveComment',
      method:"POST",
      data:{
        pkid:id,
        conent: content
      },
      success:function(res){
        console.log(res)
        if(res.data.data == true){
          let date = new Date
          let userInfo = wx.getStorageSync("userInfo");
          // console.log(date)
          console.log(formatTime.formatTime(date))
          let Object = {
            content: content,
            headurl: userInfo.headimg,
            username: userInfo.nickname,
            createtime: formatTime.formatTime(date)
          };
          lsitCSComment.unshift(Object)
          console.log(lsitCSComment)
            that.setData({
              lsitCSComment: lsitCSComment
            })
        }
        that.setData({
          inputShow: false
        })
      }
    })
  },
  loseblur(){
    this.setData({
      inputShow: false
    })
  },

  inputShow(){
    this.setData({
      inputShow:true
    })
  },
  //聚焦高度
  focusHeight(e) {
    let height = e.detail.height;
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.screenHeight / res.screenWidth)
        if (res.screenHeight / res.screenWidth > 1.8) {
          that.setData({
            bottom: height * 2 + 18 + 'rpx'
          })
        } else {
          that.setData({
            bottom: height * 2  + 'rpx'
          })
        }
      },
    })
    console.log(e.detail)

  },





})