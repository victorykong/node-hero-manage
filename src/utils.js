/**
 * 处理返回数据
 * @param {*} url   接口
 * @param {*} data  需要处理的数据
 */

const formatResult = (url, data) => {

    const copy = [...data];
    copy.forEach(hero => {
        const temp = {};
        for (let key of Reflect.ownKeys(hero)) {
            if (url_map[url].includes(key)) {
                temp[key] = hero[key];
                delete hero[key]
                hero['extra_skills'] = temp;
            }
        }
    })

    return copy;
}


// 映射的接口
const url_map = {
    get_added_hero_list: ["eid", "extra_skills_name", "logo", "large_img"]
};

module.exports = {
    formatResult
}


