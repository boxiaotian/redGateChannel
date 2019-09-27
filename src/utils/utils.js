
function getUrlKey(e) {
  return decodeURIComponent((new RegExp("[?|&]" + e + "=([^&;]+?)(&|#|;|$)").exec(window.location.href) || [, ""])[1].replace(/\+/g, "%20")) || null
}
function urlEncode(e) {
  return e = (e + "").toString(), encodeURIComponent(e).replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A").replace(/%20/g, "+")
}

function isWeiXin() {
  return "micromessenger" == window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i)
}

function isAndroid() {
  return "android" == window.navigator.userAgent.toLowerCase().match(/android/i);
}


function onBridgeReady(WeixinParameter) {
  return new Promise((resolve, reject) => {
    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
      }
    } else {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', WeixinParameter,
        res => {
          // let res1 = 
          return resolve(res)
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          }
        });
    }
  })
}

export { getUrlKey, urlEncode, isWeiXin, isAndroid, onBridgeReady }