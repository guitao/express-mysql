const {
    pool,
    router,
    Result
} = require('../connect');

router.post('/', (req, res) => {
    let sql = 'select * from post';

    pool.getConnection((err, coon) => {
        coon.query(sql, (err, result) => {
            if (err) {
                console.log('[SELECT ERROR]:', err.message)
            } else {
                res.json(new Result({
                    data: result
                }))
            }
        })
        coon.release(); // 释放连接池，等待别的连接使用
    })

})

module.exports = router;