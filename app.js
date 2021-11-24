let express = require('express')
let mysql = require('mysql')

let app = express()

let connection = mysql.createConnection({
  host: '42.192.51.46',
  user: 'root',
  password: 'Gt1213800%',
  database: 'test'
})

connection.connect(err => {
  if (err) throw err;

  console.log("mysql数据库连接成功...")
})

// 查询全部数据
app.get('/getUserInfo', (req, res) => {
  let params = req.query
  console.log("----params----", params)
  let sql = ''
  if (params.name == undefined || params.name == '') {
    sql = 'select * from userinfo'
  } else {
    sql = 'select * from userinfo  where name= ?'
  }

  let where_value = [params.name]

  connection.query(sql, where_value, (err, result) => {
    if (err) {
      console.log('[SELECT ERROR]:', err.message)
    }
    res.json(result)
  })
})

// 增加数据
app.get('/postInfo', (req, res) => {
  let sql = 'select * from post'

  connection.query(sql, (err, result) => {
    if (err) {
      console.log("[post_error]:", err)
    }
    res.json(result);
  })
})


let server = app.listen(3333, () => {
  console.log('server is running in port 3333...')
})