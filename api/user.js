const {
    pool,
    router,
    Result
} = require('../connect');
const md5 = require('../utils/md5');
const jwt = require('jsonwebtoken');
const boom = require('boom');
const { body, validationResult } = require('express-validator');
const {
    CODE_ERROR,
    CODE_SUCCESS,
    PRIVATE_KEY,
    JWT_EXPIRED
} = require('../utils/constant');
const { queryOne } = require('../utils/index')

router.post('/login', (req, res, next) => {
    const err = validationResult(req);
    console.log("====err====", err);
    // 如果验证出错，error不为空[]
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        res.json('this is login api')
    }

})

router.post('/register', (req, res, next) => {
    const err = validationResult(req);
    console.log("====err====", err);
    // 如果验证出错，error不为空[]
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { username, password } = req.body;
        res.json('this is register api')
    }

})

router.get('/userinfo', (req, res) => {
    let params = req.query
    console.log("----params----", params)
    let sql = ''
    if (params.username == undefined || params.username == '') {
        sql = 'select * from user'
    } else {
        sql = 'select * from user  where username= ? and password=?'
    }

    let where_value = [params.username, params.password]
    queryOne(sql, where_value).then(result => {
        console.log(result)
        res.json(new Result({
            data: result
        }))
    })
})

module.exports = router;