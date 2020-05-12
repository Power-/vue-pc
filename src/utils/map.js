//百度地图注册服务
export default {
  init: function(AK) {
    const BMapURL =
      `https://api.map.baidu.com/api?v=3.0&ak=${AK}&s=1&callback=onBMapCallback`;

    // eslint-disable-next-line
    return new Promise((resolve, reject) => {
      // 百度地图异步加载回调处理
      window.onBMapCallback = function() {
        console.log('百度地图脚本初始化成功...');
        // eslint-disable-next-line
        resolve(BMap);
      };

      // 插入script脚本
      let scriptNode = document.createElement('script');
      scriptNode.setAttribute('type', 'text/javascript');
      scriptNode.setAttribute('src', BMapURL);
      document.body.appendChild(scriptNode);
    });
  }
};
