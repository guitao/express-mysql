const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const router = express.Router();

const options = {
    host: '42.192.51.46',
    user: 'root',
    password: 'Gt1213800%',
    port: '3306',
    database: 'test',
    connectTimeout: 5000,
    multipleStatements: false
}
// 跨域处理
app.use(cors());
// json请求
app.use(express.json())
// 表单请求
app.use(express.urlencoded({
    extended: false
}))

let pool;
rePool();

function rePool() {
    // 断线重连机制
    pool = mysql.createPool({
        ...options,
        waitForConnections: true,
        connectTimeout: 100,
        queueLimit: 10
    })
    pool.on("error", err => err.code === 'PROTOCOL_CONNECTION_LOST' && setTimeout(rePool, 2000))
    app.all('*', (req, res, next) => pool.getConnection(err => err && setTimeout(rePool, 2000) || next()));
}

function Result({
    code = 1,
    msg = '',
    data = {}
}) {
    this.code = code;
    this.msg = msg;
    this.data = data;
}

module.exports = {
    pool,
    Result,
    router,
    app
}