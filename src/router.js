const Router = require('koa-router');
const Controller = require('./controller.js');
const middleware = require('./middleware.js');

const page = new Router();

page
    .use(middleware.validateParams())

    .post('/hero_u_register', ctx => Controller.hero_u_register(ctx))
    .post('/hero_u_login', ctx => Controller.hero_u_login(ctx))
    .use(middleware.verifyPermission())

    .post("/get_added_hero_list", ctx => Controller.get_added_hero_list(ctx))
    .get("/get_notadd_hero_list", ctx => Controller.get_notadd_hero_list(ctx))
    .post("/get_hero_detail", ctx => Controller.get_hero_detail(ctx))
    .get('/get_extra_skills_list', ctx => Controller.get_extra_skills_list(ctx))
    .post('/set_like_of_hero', ctx => Controller.set_like_of_hero(ctx))
    .post('/update_hero_status', ctx => Controller.update_hero_status(ctx))
    .post('/update_hero_extra_skills', ctx => Controller.update_hero_extra_skills(ctx))
    .get('/hero_user_exit', ctx => Controller.hero_user_exit(ctx))

module.exports = page;