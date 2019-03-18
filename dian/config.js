/**
 * 连接服务端地址
 */


// const HOST = "http://192.168.10.108:8080/";



const HOST = '';
//  const HOST = 'http://192.168.10.223:8081/';





const QQ_MAP_KEY = ""
/**
 * 是否需要获取unionid
 * 若此项为true,则登录时候会多做一步服务端完全资料获取(包括获取unionid)
 */
const FULL_LOGIN = true; 

module.exports = {
  // ImgHost: ImgHost,
  host: HOST,
  fullLogin: FULL_LOGIN,
  mapKey: QQ_MAP_KEY
}  