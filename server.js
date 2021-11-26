const {
  app,
  pool,
  Result
} = require('./connect');
const user = require('./api/user')
const posts = require('./api/posts')


// 请求拦截
app.all('*', (req, res, next) => {
  next();
})

app.use('/user', user);
app.use('/posts', posts);


app.listen(3333, () => {
  console.log('server is running in port 3333...')
})