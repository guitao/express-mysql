const {
    pool
} = require('../connect');

//新建查询连接
function querySql(sql, where_value = '') {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, coon) => {
            try {
                coon.query(sql, where_value, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                })
            } catch (e) {
                reject(e);
            } finally {
                //释放连接
                coon.release();
            }
        })
    })
}

//查询一条语句
function queryOne(sql, where_value = '') {
    return new Promise((resolve, reject) => {
        querySql(sql, where_value).then(res => {
            console.log('res===', res)
            if (res && res.length > 0) {
                resolve(res[0]);
            } else {
                resolve(null);
            }
        }).catch(err => {
            reject(err);
        })
    })
}

module.exports = {
    querySql,
    queryOne
}
