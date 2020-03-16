const Koa = require('koa');
const path = require('path');
const static = require('koa-static'); // 静态文件
const bodyParser = require("koa-bodyparser");
const page = require('./src/router.js'); // 路由
const cors = require('koa2-cors');

const port = 8001;

const app = new Koa();
const staticPath = './src/static';

app
    .use(static(path.join(__dirname, staticPath)))
    .use(cors({
        origin: "*",
        credentials: false,
        allowMethods: ['GET', 'POST'],
    }))
    .use(bodyParser({ enableTypes: ['json'] }))
    .use(page.routes());



app.listen(port, () => console.log('server is running...'));