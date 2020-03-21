const model = require('./model.js');
const utils = require("./utils.js");
const wrapper = require('./wrapper.js');
const _config = require('./config.js');

const Success_result = { // 成功信息对象
    code: 0,
    data: null,
    message: "操作成功"
};


// 获取已添加列表的英雄
const get_added_hero_list = async ctx => wrapper(ctx)(async () => {

    const { position_type, search_key } = ctx.request.body;

    let sql = ``;
    let params = [];
    if (position_type !== 0 && search_key !== "") {
        sql = `SELECT hero_detail.*,hero_extra_skills.* FROM 
                hero_detail LEFT JOIN hero_extra_skills ON hero_detail.eid = hero_extra_skills.eid
                WHERE is_add=1 AND hero_name like ? AND 
                position=?
                ORDER BY update_time DESC;`
        params = [search_key + "%", position_type]
    } else {
        sql = `SELECT hero_detail.*,hero_extra_skills.* FROM 
                hero_detail LEFT JOIN hero_extra_skills ON hero_detail.eid = hero_extra_skills.eid
                WHERE is_add=1
                ORDER BY update_time DESC;`
    }

    if (position_type === 0 && search_key !== "") {
        sql = `SELECT hero_detail.*,hero_extra_skills.* FROM 
                hero_detail LEFT JOIN hero_extra_skills ON hero_detail.eid = hero_extra_skills.eid
                WHERE is_add=1 AND hero_name like ? ORDER BY update_time DESC;`
        params = [search_key + "%"]
    }

    if (position_type !== 0 && search_key === "") {
        sql = `SELECT hero_detail.*,hero_extra_skills.* FROM 
                hero_detail LEFT JOIN hero_extra_skills ON hero_detail.eid = hero_extra_skills.eid
                WHERE is_add=1 AND position=?
                ORDER BY update_time DESC;`
        params = [position_type]
    }

    const res = await model.query(sql, params);

    const targetRes = utils.formatResult(ctx.request.url.substr(1), res);

    ctx.body = { ...Success_result, data: targetRes }


})



// 获取待添加的英雄列表
const get_notadd_hero_list = async ctx => wrapper(ctx)(async () => {
    const sql = `SELECT hid,avatar_url,hero_name, position FROM hero_detail WHERE is_add=0;`;

    const res = await model.query(sql);

    ctx.body = { ...Success_result, data: res }
})




// 查看英雄详情
const get_hero_detail = async ctx => wrapper(ctx)(async () => {
    const { hid } = ctx.request.body;

    const sql = `SELECT hero_detail.*,hero_extra_skills.*,hero_property.*,hero_skills.* FROM hero_detail 
                    LEFT JOIN hero_extra_skills ON hero_detail.eid = hero_extra_skills.eid
                    LEFT JOIN hero_property ON hero_detail.hid = hero_property.hid
                    LEFT JOIN hero_skills ON hero_detail.hid = hero_skills.hid
                    WHERE hero_detail.hid=?;`;
    // 否则将会把整个表查询出来


    const res = await model.query(sql, [hid]);

    const targetRes = utils.formatResult(ctx.request.url.substr(1), res);

    ctx.body = { ...Success_result, data: targetRes[0] };


})



// 获取召唤师技能列表
const get_extra_skills_list = ctx => wrapper(ctx)(async () => {
    const sql = `SELECT * FROM hero_extra_skills;`;
    const res = await model.query(sql);
    ctx.body = { ...Success_result, data: res };
})



// 为英雄点赞
const set_like_of_hero = async ctx => wrapper(ctx)(async () => {
    const { hid } = ctx.request.body;
    const sql = `UPDATE hero_detail SET like_count=like_count+1 WHERE hid=?;`;
    const res = await model.query(sql, [hid]);

    if (res && res.affectedRows === 1) {
        ctx.body = Success_result;
    } else {
        throw new Error(); // action wrapper catch
    }
})




// 添加/删除英雄
const update_hero_status = async ctx => wrapper(ctx)(async () => {
    const { status, hid } = ctx.request.body;
    const sql = `UPDATE hero_detail SET is_add=?,update_time=${Date.now()}  WHERE hid=?;`;
    const res = await model.query(sql, [status, hid]);

    if (res && res.affectedRows === 1) {
        ctx.body = Success_result;
    } else {
        throw new Error();
    }
})




// 更新英雄的召唤师技能
const update_hero_extra_skills = async ctx => wrapper(ctx)(async () => {
    const { eid, hid } = ctx.request.body;
    const sql = `UPDATE hero_detail SET eid=?,update_time=${Date.now()}  WHERE hid=?;`
    const res = await model.query(sql, [eid, hid]);

    if (res && res.affectedRows === 1) {
        ctx.body = Success_result;
    } else {
        throw new Error();
    }
})


// 注册
const hero_u_register = async ctx => wrapper(ctx)(async () => {
    const { username, password, nickname } = ctx.request.body;

    const checkSql = `SELECT uuid from hero_user WHERE uuid=?`
    const checkRes = await model.query(checkSql, [username]);
    if (checkRes instanceof Array && checkRes.length > 0) {
        throw new Error('账号已存在，请重新输入！');
    }

    const sql = `INSERT INTO hero_user (uuid,upassword,uname,u_register_time) VALUE (?,?,?,?);`;
    const res = await model.query(sql, [username, password, nickname, Date.now()]);

    if (res && res.affectedRows === 1) {
        ctx.body = Success_result;
    } else {
        throw new Error();
    }
})

// 登录
const hero_u_login = async ctx => wrapper(ctx)(async () => {
    const { username, password } = ctx.request.body;

    const checkSql = `SELECT uname,u_login_time FROM hero_user WHERE uuid=? AND upassword=?; `
    const checkRes = await model.query(checkSql, [username, password]);

    if (checkRes instanceof Array && checkRes.length === 0) {
        throw new Error('用户名或密码错误，请稍后重试！');
    } else if (checkRes instanceof Array && checkRes.length > 1) {
        throw new Error('登录异常，请稍后重试！');
    }

    const [nickname, time] = [
        checkRes[0].uname || "default",
        checkRes[0].u_login_time || 0
    ]
    const sql = `UPDATE hero_user SET u_login_time=? WHERE uuid=?;`
    const res = await model.query(sql, [Date.now(), username]);

    if (res && res.affectedRows === 1) {
        // 设置 session 
        ctx.session.user_info = { id: username } // 仅做一个校验的作用

        ctx.body = { ...Success_result, data: { nickname, last_login_time: time } }
    } else {
        throw new Error();
    }

})


// 退出
const hero_user_exit = async ctx => wrapper(ctx)(async () => {
    // const cookie = utils.cookie2Object(ctx.request.header.cookie);
    // const session_id = cookie[_config.session_key];

    ctx.session.user_info = null; // 清除 session, redis 中的信息变为 null
    // const result = await (new (require('./redis-store.js'))).destroy(session_id); // 清除 redis key 


    ctx.body = Success_result;
})


module.exports = {
    get_added_hero_list,
    get_notadd_hero_list,
    get_hero_detail,
    get_extra_skills_list,
    set_like_of_hero,
    update_hero_status,
    update_hero_extra_skills,
    hero_u_register,
    hero_u_login,
    hero_user_exit
}