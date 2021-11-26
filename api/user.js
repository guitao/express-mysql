const {
    pool,
    router,
    Result
} = require('../connect');

router.get('/userinfo', (req, res) => {
    let params = req.query
    console.log("----params----", params)
    let sql = ''
    if (params.name == undefined || params.name == '') {
        sql = 'select * from user'
    } else {
        sql = 'select * from user  where name= ?'
    }

    let where_value = [params.name]


    pool.getConnection((err, coon) => {
        coon.query(sql, where_value, (err, result) => {
            if (err) {
                console.log('[SELECT ERROR]:', err.message)
            }
            res.json(new Result({
                data: result
            }))
        })
        coon.release(); // 释放连接池，等待别的连接使用
    })
})

module.exports = router;