const model = require('./model.js');
const utils = require("./utils.js");

const Success_result = {
    code: 0,
    data: null,
    message: "操作成功"
};


// 获取已添加列表的英雄
const get_added_hero_list = async ctx => {

    const { position_type, search_key } = ctx.request.body;

    // 会有 sql 注入的风险, 待完善
    let sql = ``;
    if (position_type !== 0 && search_key !== "") {
        sql = `SELECT hero_detail.*,hero_extra_skills.* FROM 
                hero_detail LEFT JOIN hero_extra_skills ON hero_detail.eid = hero_extra_skills.eid
                WHERE is_add=1 AND hero_name like '${search_key}%' AND 
                position=${position_type}
                ORDER BY update_time DESC `
    } else {
        sql = `SELECT hero_detail.*,hero_extra_skills.* FROM 
                hero_detail LEFT JOIN hero_extra_skills ON hero_detail.eid = hero_extra_skills.eid
                WHERE is_add=1
                ORDER BY update_time DESC `
    }

    if (position_type === 0 && search_key !== "") {
        sql = `SELECT hero_detail.*,hero_extra_skills.* FROM 
                hero_detail LEFT JOIN hero_extra_skills ON hero_detail.eid = hero_extra_skills.eid
                WHERE is_add=1 AND hero_name like '${search_key}%'
                ORDER BY update_time DESC `
    }

    if (position_type !== 0 && search_key === "") {
        sql = `SELECT hero_detail.*,hero_extra_skills.* FROM 
                hero_detail LEFT JOIN hero_extra_skills ON hero_detail.eid = hero_extra_skills.eid
                WHERE is_add=1 AND position=${position_type}
                ORDER BY update_time DESC `
    }

    const res = await model.query(sql);

    const targetRes = utils.formatResult(ctx.request.url.substr(1), res);

    ctx.body = { ...Success_result, data: targetRes }

}

// 获取待添加的英雄列表
const get_notadd_hero_list = async ctx => {
    const sql = `SELECT hid,avatar_url,hero_name, position FROM hero_detail WHERE is_add=0;`;

    const res = await model.query(sql);

    ctx.body = { ...Success_result, data: res }
}

// 查看英雄详情
const get_hero_detail = async ctx => {
    const { hid } = ctx.request.body;

    const sql = `SELECT hero_detail.*,hero_extra_skills.*,hero_property.*,hero_skills.* FROM hero_detail 
                    LEFT JOIN hero_extra_skills ON hero_detail.eid = hero_extra_skills.eid
                    LEFT JOIN hero_property ON hero_detail.hid = hero_property.hid
                    LEFT JOIN hero_skills ON hero_detail.hid = hero_skills.hid
                    WHERE hero_detail.hid=${hid};`;


    const res = await model.query(sql);

    const targetRes = utils.formatResult(ctx.request.url.substr(1), res);

    ctx.body = { ...Success_result, data: targetRes[0] };


}

// 获取召唤师技能列表
const get_extra_skills_list = async ctx => {
    const sql = `SELECT * FROM hero_extra_skills`;

    const res = await model.query(sql);

    ctx.body = { ...Success_result, data: res };
}

// 为英雄点赞
const set_like_of_hero = async ctx => {
    const { hid } = ctx.request.body;
    const sql = `UPDATE hero_detail SET like_count=like_count+1 WHERE hid=${hid};`;
    const res = await model.query(sql);

    if (res && res.affectedRows === 1) {
        ctx.body = Success_result;
    }
}

// 添加/删除英雄
const update_hero_status = async ctx => {
    const { hid, status } = ctx.request.body;
    const sql = `UPDATE hero_detail SET is_add=${status},update_time=${Date.now()}  WHERE hid=${hid};`;
    const res = await model.query(sql);

    if (res && res.affectedRows === 1) {
        ctx.body = Success_result;
    }
}

// 更新英雄的召唤师技能
const update_hero_extra_skills = async ctx => {
    const { hid, eid } = ctx.request.body;
    const sql = `UPDATE hero_detail SET eid=${eid},update_time=${Date.now()}  WHERE hid=${hid};`
    const res = await model.query(sql);

    if (res && res.affectedRows === 1) {
        ctx.body = Success_result;
    }
}



module.exports = {
    get_added_hero_list,
    get_notadd_hero_list,
    get_hero_detail,
    get_extra_skills_list,
    set_like_of_hero,
    update_hero_status,
    update_hero_extra_skills
}