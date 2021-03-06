const path = require('path')

const sassImporter = function (url) {
  if (url[0] === '~' && url[1] !== '/') {
    return {
      file: path.resolve(__dirname, '..', 'node_modules', url.substr(1))
    }
  }

  const reg = /^@styles\/(.*)/
  return {
    file: reg.test(url) ? path.resolve(__dirname, '..', 'src/styles', url.match(reg)[1]) : url
  }
}

const config = {
  projectName: 'redGateChannel',
  date: '2019-9-23',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: {
    babel: {
      sourceMap: true,
      presets: [
        ['env', {
          modules: false
        }]
      ],
      plugins: [
        'transform-decorators-legacy',
        'transform-class-properties',
        'transform-object-rest-spread'
      ]
    },
    sass: {
      importer: sassImporter
    }
  },
  defineConstants: {
  },
  alias: {
    '@/assets': path.resolve(__dirname, '..', 'src/assets'),
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/constants': path.resolve(__dirname, '..', 'src/constants'),
    '@/models': path.resolve(__dirname, '..', 'src/models'),
    '@/redux': path.resolve(__dirname, '..', 'src/redux'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  weapp: {
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: [
              'last 3 versions',
              'Android >= 4.1',
              'ios >= 8'
            ]
          }
        },
        pxtransform: {
          enable: true,
          config: {

          }
        },
        url: {
          enable: true,
          config: {
            limit: 10240 // 设定转换尺寸上限
          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    }
  },
  h5: {
    publicPath: process.env.NODE_ENV === 'development' ? "/" : "./",
    staticDirectory: 'static',
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: [
              'last 3 versions',
              'Android >= 4.1',
              'ios >= 8'
            ]
          }
        },
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    },
    devServer: {
      https: true
    },
    router: {
      customRoutes: {
        '/pages/index/index': '/index',
        '/pages/home/index': '/home',
        '/pages/special_list/index': '/specialList',
        '/pages/reds_selection/index': '/redsSelection',
        '/pages/product_detail/index': '/productDetail',
        '/pages/confirm_order/index': '/confirmOrder',
        '/pages/commodity_pay/index': '/CommodityPay',
        '/pages/enjoy_doctor/index': '/enjoyDoctor',
        '/pages/doctor_detail/index': '/doctorDetail',
        '/pages/doctor_pay/index': '/doctorPay',
        '/pages/login/index': '/login',
        '/pages/red_door_package/index': '/redDoorPackage',
        '/pages/privilege/index': '/privilege',
        '/pages/red_powder_vip/index': '/redPowderVip',
        '/pages/spree/index': '/spree',
        '/pages/carrier_gift_packs/index': '/carrierGiftPacks',
        '/pages/steward_ten_gift/index': '/stewardTenGift',
        '/pages/my/index': '/my',
        '/pages/my_effort/index': '/myEffort',
        '/pages/selfsupport_effort/index': '/selfsupportEffort',
        '/pages/my_order/index': '/myOrder',
        '/pages/fans_order/index': '/fansOrder',
        '/pages/fans_edit/index': '/fansEdit',
        '/pages/fans_project/index': '/fansProject',
        '/pages/fans_info/index': '/fansInfo',
        '/pages/fans_means/index': '/fansMeans',
        '/pages/newbie_guide/index': '/newbieGuide',
        '/pages/gift_red_exchange_detail/index': '/giftRedExchangeDetail',
        '/pages/gift_red_exchange/index': '/giftRedExchange',
        '/pages/notes/index': '/notes',
        '/pages/note_detail/index': '/noteDetail',
        '/pages/note_hsptl/index': '/noteHsptl',
        '/pages/note_expound/index': '/noteExpound',
        '/pages/paysuc/index': '/paysuc',
        '/pages/customer_service/index': '/customerService',
      }
    },
    esnextModules: ['taro-ui'],
    devServer: {
      host: '192.168.1.73'
    },
    output: {
      filename: 'js/[name].[hash:8].js',
      chunkFilename: 'js/[name].[chunkhash:8].js'
    },
    miniCssExtractPluginOption: {
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[id].[chunkhash:8].css'
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
