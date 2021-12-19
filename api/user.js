const {
    router,
    Result,
    querySql,
    queryOne
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

router.post('/login', (req, res, next) => {
    const err = validationResult(req);
    console.log("====err====", err.isEmpty());
    // 如果验证出错，error不为空[]
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { username, password } = req.body;
        password = md5(password);
        console.log("==username===", username)
        console.log("==password===", password)
        const query = `select * from user where username='${username}' and password='${password}'`;
        querySql(query).then(user => {
            if (!user || user.length === 0) {
                res.json(new Result({
                    code: CODE_ERROR,
                    msg: '用户名或密码错误',
                    data: null
                }))
            } else {
                const token = jwt.sign(
                    // payload：签发的 token 里面要包含的一些数据。
                    { username },
                    // 私钥
                    PRIVATE_KEY,
                    // 设置过期时间
                    { expiresIn: JWT_EXPIRED }
                )

                let userData = {
                    name: user[0].username
                }
                res.json(new Result({
                    code: CODE_SUCCESS,
                    msg: '登录成功',
                    data: {
                        token,
                        userData
                    }
                }))
            }
        })

    }

})

// 通过用户名查询用户信息
function findUser(username) {
    const query = `select username from user where username='${username}'`;
    return queryOne(query);
}


router.post('/register', (req, res, next) => {
    const err = validationResult(req);
    // 如果验证出错，error不为空[]
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { username, password } = req.body;

        findUser(username).then(data => {
            console.log("===data====", data)
            if (data) {
                res.json(new Result({
                    code: CODE_ERROR,
                    msg: '用户已存在',
                    data: null
                }))
            } else {
                password = md5(password);
                const query = `insert into user(username, password) values('${username}', '${password}')`;
                querySql(query).then(result => {
                    if (!result || result.lenght === 0) {
                        res.json(new Result({
                            code: CODE_ERROR,
                            msg: '注册失败',
                            data: null
                        }))
                    } else {
                        const queryUser = `select * from user where username='${username}' and password='${password}'`;
                        querySql(queryUser).then(user => {
                            const token = jwt.sign(
                                { username },
                                PRIVATE_KEY,
                                { expiresIn: JWT_EXPIRED }
                            )

                            let userData = {
                                name: user[0].username
                            }

                            res.json(new Result({
                                code: CODE_SUCCESS,
                                msg: '注册成功',
                                data: {
                                    token,
                                    userData
                                }
                            }))
                        })
                    }
                })
            }
        })
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