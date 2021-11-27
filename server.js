const {
  app,
  pool,
  Result,
  router
} = require('./connect');
const user = require('./api/user')
const posts = require('./api/posts')

// 请求拦截
app.all('*', (req, res, next) => {
  next();
})

app.use('/user', user);
app.use('/posts', posts);

// 自定义统一异常处理中间件，需要放在代码最后
router.use((err, req, res, next) => {
  // 自定义用户认证失败的错误返回
  console.log('err===', err);
  if (err && err.name === 'UnauthorizedError') {
    const { status = 401, message } = err;
    // 抛出401异常
    res.status(status).json({
      code: status,
      msg: 'token失效，请重新登录',
      data: null
    })
  } else {
    const { output } = err || {};
    // 错误码和错误信息
    const errCode = (output && output.statusCode) || 500;
    const errMsg = (output && output.payload && output.payload.error) || err.message;
    res.status(errCode).json({
      code: errCode,
      msg: errMsg
    })
  }
})


app.listen(3333, () => {
  console.log('server is running in port 3333...')
})