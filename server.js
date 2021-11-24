let express = require('express')
let mysql = require('mysql')
let http = require('http');
const cors = require('cors');
let app = express()

// json请求
app.use(express.json())
// 表单请求
app.use(express.urlencoded({
  extended: false
}))
// 跨域处理
app.use(cors());

let connection = mysql.createConnection({
  host: '42.192.51.46',
  user: 'root',
  password: 'Gt1213800%',
  database: 'test'
})
reConnect();

connection.connect(err => {
  if (err) throw err;
  console.log("mysql数据库连接成功...")
})

const reConnect = () => {
  
}


// let login = false;
// 请求拦截
// app.all('*', (req, res, next) => {
//   if (!login) {
//     res.json('未登录');
//   }
//   next();
// })

app.post('/test/:data', (req, res) => {
  res.json({
    query: req.query,
    data: req.params,
    json: req.body
  })
})

// 查询user数据
app.get('/getUserInfo', (req, res) => {
  let params = req.query
  console.log("----params----", params)
  let sql = ''
  if (params.name == undefined || params.name == '') {
    sql = 'select * from user'
  } else {
    sql = 'select * from user  where name= ?'
  }

  let where_value = [params.name]

  connection.query(sql, where_value, (err, result) => {
    if (err) {
      console.log('[SELECT ERROR]:', err.message)
    }
    res.json(result)
  })
})

// 查询post数据
app.get('/postInfo', (req, res) => {
  let sql = 'select * from post'

  connection.query(sql, (err, result) => {
    if (err) {
      console.log("[post_error]:", err)
    }

    res.json(result);
  })
})


app.listen(3333, () => {
  console.log('server is running in port 3333...')
})