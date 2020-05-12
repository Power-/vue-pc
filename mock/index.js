const Mock = require('mockjs'); //mockjs 导入依赖模块
const util = require('./util'); //自定义工具模块

//返回一个函数
module.exports = function(app) {
  // 首页 最近成交

  
//'/api/bid/list?expand=user&pageSize=50&page=1'
  app.get(/\/api\/bid\/list(|\?\S*)$/, function(rep, res) {
    var json = util.getJsonFile('./api/home/cm-bid-list.json');
    res.json(Mock.mock(json));
  });
  app.get('/api/media/list', function(rep, res) {
    var json = util.getJsonFile('./api/home/api-media-list.json');
    res.json(Mock.mock(json));
  });
  app.get('/api/partner/list', function(rep, res) {
    var json = util.getJsonFile('./api/cooperation/api-partner-list.json');
    res.json(Mock.mock(json));
  });
};
