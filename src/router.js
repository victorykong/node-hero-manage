const Router = require('koa-router');
const Controller = require('./controller.js');
const middleware = require('./middleware.js');

const page = new Router();

page
    .use(middleware.validateParams())
    .post("/get_added_hero_list", ctx => Controller.get_added_hero_list(ctx))


module.exports = page;