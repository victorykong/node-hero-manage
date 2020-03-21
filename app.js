const Koa = require('koa');
const path = require('path');
const static = require('koa-static'); // 静态文件
const bodyParser = require("koa-bodyparser");
const page = require('./src/router.js'); // 路由
const cors = require('koa2-cors');
const session = require('koa-session');
const _config = require('./src/config.js');
const staticPath = './src/static';
const port = 8001;

const app = new Koa();
app.keys = _config.session_signed;


app
    .use(static(path.join(__dirname, staticPath)))
    // .use(cors({
    //     origin: "*",
    //     credentials: true,
    //     allowMethods: ['GET', 'POST'],
    // }))
    .use(bodyParser({ enableTypes: ['json'] }))
    .use(session(_config.session_config, app)) // 注意顺序
    .use(page.routes())


app.listen(port, () => console.log('server is running...'));