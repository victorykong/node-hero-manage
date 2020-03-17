/**
 * 映射的接口
 * 需要转换的数据
 */
const url_map = {
    get_added_hero_list: {
        "extra_skills": ["eid", "extra_skills_name", "logo", "large_img"]
    },
    get_hero_detail: {
        "extra_skills": ["eid", "extra_skills_name", "logo", "large_img"],
        "skills": ["static", "first", "second", "third"],
        "property": ["save", "attack", "skill"]
    }
};


/**
 * 处理返回数据
 * @param {*} url   接口
 * @param {*} data  需要处理的数据
 */

const formatResult = (url, data) => {
    let newData = [];

    data.forEach(hero => {
        const temp = {};
        Object.keys(url_map[url]).forEach(i => temp[i] = {}); // 生成第一层 key

        for (let key of Reflect.ownKeys(hero)) {
            for (let [url_id, props] of Object.entries(url_map[url])) {
                if (props.includes(key)) {
                    temp[url_id][key] = hero[key]; // 生成第二层 key
                    delete hero[key]; // 删除源对象第一层 key(repeat)
                }
            }
        }

        newData.push({ ...hero, ...temp })
    })

    return newData;
}



/**
 * get 请求带参数，需格式化拿到 url
 * @param {*} url 
 */
const formatGetUrl = url => url.split("?")[0]



module.exports = {
    formatResult,
    formatGetUrl
}