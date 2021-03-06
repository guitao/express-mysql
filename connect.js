const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const router = express.Router();
const mysqlConfig = require('./db/dbConfig')

// 跨域处理
app.use(cors());
// json请求
app.use(express.json())
// 表单请求
app.use(express.urlencoded({
    extended: false
}))

// let pool;
// rePool();

// function rePool() {
//     // 断线重连机制
//     pool = mysql.createPool({
//         ...mysqlConfig,
//         waitForConnections: true,
//         connectTimeout: 100,
//         queueLimit: 10
//     })
//     pool.on("error", err => err.code === 'PROTOCOL_CONNECTION_LOST' && setTimeout(rePool, 2000))
//     app.all('*', (req, res, next) => pool.getConnection(err => err && setTimeout(rePool, 2000) || next()));
// }

function Result({
    code = 1,
    msg = '',
    data = {}
}) {
    this.code = code;
    this.msg = msg;
    this.data = data;
}

//连接mysql
function connect() {
    const { host, user, password, database } = mysqlConfig;
    return mysql.createConnection({
        host,
        user,
        password,
        database
    })
}

//新建查询连接
function querySql(sql) {
    const conn = connect();
    return new Promise((resolve, reject) => {
        try {
            conn.query(sql, (err, res) => {
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
            conn.end();
        }
    })
}

//查询一条语句
function queryOne(sql) {
    return new Promise((resolve, reject) => {
        querySql(sql).then(res => {
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
    Result,
    router,
    app,
    querySql,
    queryOne
}