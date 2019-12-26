var express = require('express');
var router = express.Router();
var db = require("../db");
var jwt = require('jsonwebtoken')
/*登录*/
router.post('/login', function (req, res, next) {
  //sql查询
  var sql = 'SELECT * FROM test where username = ? and password = ?';
  //查询数据
  var sqlParams = [req.body.username, req.body.password]
  //开始查询
  db.query(sql, sqlParams, function (result,fields) {
    //没有数据
    if (result.length == 0) {
      res.send({ code: 401, message: "没有数据" });
    } else {
      //设置token
      let token = jwt.sign({ id: result[0].id }, "lyhq", {
        expiresIn: 60 * 30 * 1  // 0.5小时过期
      });
      res.send({ code: 200, data: result[0],token:token});
    }
  })
});

module.exports = router;
