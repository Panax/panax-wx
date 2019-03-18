//logs.js
const util = require('../../utils/util.js')
import http from '../../dian/index';
import constant from '../../dian/lib/constant.js';
import config from '../../dian/config.js'
const recorderManager = wx.getRecorderManager();
Page({
  data: {
    problem: '',
    pkid: '',
    one: false,
    two: true,
    three: true,
    tape: true,
    formId: '',
    autoForce: false,
    mess: '',
    arr: ['', '', ''，'']
  },
  onLoad: function(options) {
    console.log(options)
    // console.log(parseInt(Math.random()*3))
    this.setData({
      formId: options.formId
    })
    if (options.problem) {
      this.setData({
        problem: options.problem
      })
    }
  },
  onShow() {

    this.setData({
      one: false,
      two: true,
    })
  },
  getProblem(e) {
    this.setData({
      problem: e.detail.value
    })

  },
  complete() {
    let that = this;
    // console.log(e.detail.value)
    let formId = that.data.formId;
    let problem = that.data.problem;
    let pkid = that.data.pkid;
    if (problem.length == 0) {
      wx.showToast({
        title: '请输入你的问题',
      })
      return;
    }
    if (problem.length <= 10) {
      wx.showToast({
        title: '请详细描述问题',
      })
      return;
    }
    let arr = this.data.arr;
    this.setData({
      one: true,
      two: false,
      mess: arr[parseInt(Math.random() * 3)]
    })
    http.request({
      url: 'xcx/question/front/saveQuest',
      method: 'POST',
      data: {
        question: problem,
        formid: formId,
        pkid: pkid
      },
      success: function(res) {
        console.log(res)
        if (res.data.data.length === 0) {
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/answer/no_answer',
            })
          }, 2000);
          
        } else {
          
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/answer/explain?problem=' + problem + "&formId=" + formId,
            })
          }, 2000);

          

        }
      }
    })
  },

  // submit(e){
  //   let formId = e.detail.formId;
  //   let problem = this.data.problem;

  //   console.log(formId)


  //   wx.showLoading({
  //     title: '加载中',
  //     success: function (res) {

  //     }
  //   }) 
  // },
  // longTap(e){
  //   console.log(e)
  // },
  longtouch(e) {
    console.log(e)
    this.setData({
      tape: false
    })
    const options = {
      duration: 10000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
      console.log("err")
    })
  },
  touchstart(e) {

  },
  touchend(e) {
    // console.log(e)
    this.setData({
      tape: true,
    })
    let that = this;
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath);
      const {
        tempFilePath
      } = res
      wx.showLoading({
        title: '语音转录中',
      })
      wx.uploadFile({
        url: config.host + 'xcx/ans/front/audio/saveRecordAudio',
        filePath: tempFilePath,
        name: 'file',
        formData: {
          dian_token: wx.getStorageSync(constant.DIAN_TOKEN),
          xcxflag: constant.XCX_FLAG,
          temppaths: tempFilePath,
          audioFlag: 1,
          pkcode: ''
        },
        success: function(res) {
          console.log(JSON.parse(res.data));
          let data = JSON.parse(res.data)
          wx.hideLoading();
          if (data.data.errormsg != "") {
            wx.showToast({
              title: data.data.errormsg,
            })
          }
          that.setData({
            problem: that.data.problem + data.data.result,
            pkid: data.data.pkid,
            autoForce: true
          })
        }
      })
    })
  },


})