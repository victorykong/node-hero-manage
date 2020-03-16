const model = require('./model.js');

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
                WHERE hero_name like '${search_key}%' AND 
                position=${position_type}
                ORDER BY update_time DESC `
    } else {
        sql = `SELECT hero_detail.*,hero_extra_skills.* FROM 
                hero_detail LEFT JOIN hero_extra_skills ON hero_detail.eid = hero_extra_skills.eid
                ORDER BY update_time DESC `
    }

    if (position_type === 0 && search_key !== "") {
        sql = `SELECT hero_detail.*,hero_extra_skills.* FROM 
                hero_detail LEFT JOIN hero_extra_skills ON hero_detail.eid = hero_extra_skills.eid
                WHERE hero_name like '${search_key}%'
                ORDER BY update_time DESC `
    }

    if (position_type !== 0 && search_key === "") {
        sql = `SELECT hero_detail.*,hero_extra_skills.* FROM 
                    hero_detail LEFT JOIN hero_extra_skills ON hero_detail.eid = hero_extra_skills.eid
                    WHERE position=${position_type}
                    ORDER BY update_time DESC `
    }

    const res = await model.query(sql);

    ctx.body = { ...Success_result, data: res }
}


module.exports = {
    get_added_hero_list
}