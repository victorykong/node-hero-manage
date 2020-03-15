const Koa = require('koa');
const path = require('path');
const static = require('koa-static'); // 静态文件
const bodyParser = require("koa-bodyparser");
const page = require('./src/router.js'); // 路由


const app = new Koa();
const staticPath = './src/static';

app
    .use(static(path.join(__dirname, staticPath)))
    .use(bodyParser({ enableTypes: ['json'] }))
    .use(page.routes())
    .use(page.allowedMethods());
   

app.listen(3000, () => console.log('server is running...'));