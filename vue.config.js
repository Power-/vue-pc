const path = require('path');
// var webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

//用于标记项目发布时间
process.env.VUE_APP_BUILDTIME = new Date().toString() + getGitVersionInfo();

/*
_externals 、cdn 、 chainWebpack 配置，需要搭配index.html 页面中输出（现已注释）
*/
const _externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  axios: 'axios',
};

const cdn = {
  // 开发环境
  dev: {
    css: [],
    js: [],
  },
  // 生产环境
  build: {
    css: [],
    js: [
      'https://cdn.bootcss.com/vue/2.5.17/vue.min.js',
      'https://cdn.bootcss.com/vue-router/3.0.1/vue-router.min.js',
      'https://cdn.bootcss.com/axios/0.18.0/axios.min.js',
    ],
  },
};

module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  publicPath: '/dist/',

  // where to output built files
  // 打包后的输出目录
  //outputDir: 'dist',
  assetsDir: 'static',

  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // webpack 配置~
  //chainWebpack: () => {},
  chainWebpack: config => {
    // 去除页面prefetch
    // config.plugins.delete('prefetch');
    // 修复HMR
    config.resolve.symlinks(true);
    //
    config.externals = _externals;
    config.plugin('html').tap(args => {
      if (process.env.NODE_ENV === 'production') {
        args[0].cdn = cdn.build;
      }
      // if (process.env.NODE_ENV === 'development') {
      //   args[0].cdn = cdn.dev
      // }
      return args;
    });
    if (process.env.NODE_ENV === 'production') {
      config.module
        .rule('images')
        .use('url-loader')
        .tap(options => {
          options.publicPath = process.env.VUE_APP_CDN_DOMAIN;
          options.limit = 3000;

          return options;
        });
    }
  },

  //configureWebpack: () => {},
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      //压缩插件
      config.plugins.push(
        new CompressionPlugin({
          test: /\.js$|\.html$|.\css/, //匹配文件名
          threshold: 10240, //对超过10k的数据压缩
          deleteOriginalAssets: false, //不删除源文件
        })
      );

      // js 压缩自定义配置（去console插件）
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_debugger: true,
              drop_console: true,
            },
          },
          sourceMap: false,
          parallel: true,
        })
      );
    } else {
      // 为开发环境修改配置...
      config.devtool = 'source-map';
    }
  },

  /*
  自动化导入全局less变量
  使用帮助：
    1、vue add style-resources-loader
    2、选择less
    3、插件会自动插入如下代码
   */
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, 'src/assets/css/variable.less')],
    },
  },

  // generate sourceMap for production build?
  // 生产环境的sourceMap 要不要？
  productionSourceMap: false,

  // 构建时开啓多进程处理babel编译
  parallel: require('os').cpus().length > 1,

  // configure webpack-dev-server behavior
  // Webpack dev server
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8094,
    https: false,
    hotOnly: false,
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
    proxy: {
      '/': {
        target: 'http://pp-m.njfae.com.cn/',
        ws: false,
      },
      '/api': {
        target: 'http://pp-m.njfae.com.cn/',
      },
    },
    before: process.env.VUE_APP_MOCK === 'true' ? require('./mock') : null,
  },
};

function getGitVersionInfo() {
  if (process.env.NODE_ENV === 'production') {
    try {
      var fs = require('fs');
      var gitHEAD = fs.readFileSync('.git/HEAD', 'utf-8').trim(); // ref: refs/heads/master
      var ref = gitHEAD.split(': ')[1]; // refs/heads/master
      var branchName = gitHEAD.split('/')[2]; // master
      var gitVersion = fs.readFileSync('.git/' + ref, 'utf-8').trim(); // git版本号，例如：db3b1d0e91f41026ebf50fc20a17df8a5317dd57
      var gitCommitVersion = '"' + branchName + ': ' + gitVersion + '"'; // 例如dev环境: "master: db3b1d0e91f41026ebf50fc20a17df8a5317dd57"
      return gitCommitVersion;
    } catch (error) {
      console.log(error);
      return '';
    }
  } else {
    return '';
  }
}
