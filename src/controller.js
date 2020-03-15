const model = require('./model.js');
const constants = require('./constants.js');
const Handle = require('./handle.js');



// 获取已添加列表的英雄
const get_added_hero_list = async ctx => {


    console.log('process')

    // const { position_type, search_key } = ctx.request.body;





    // ctx.body = {
    //     code: -1,
    //     data: null,
    //     message: "name require"
    // }

    // const sql = `SELECT hero_detail.*,hero_extra_skills.* FROM 
    // hero_detail LEFT JOIN hero_extra_skills ON hero_detail.eid = hero_extra_skills.eid
    // ORDER BY update_time DESC `;

    // const res = await model.query(sql);
    // console.log(res)

    // ctx.body = res;

}


module.exports = {
    get_added_hero_list
}