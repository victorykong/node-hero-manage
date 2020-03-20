const Params = {
    get_added_hero_list: {
        position_type: "[object Number]",
        search_key: "[object String]"
    },
    get_hero_detail: {
        hid: "[object Number]"
    },
    set_like_of_hero: {
        hid: "[object Number]"
    },
    update_hero_status: {
        hid: "[object Number]",
        status: "[object Number]"
    },
    update_hero_extra_skills: {
        hid: "[object Number]",
        eid: "[object Number]"
    },
    hero_u_register: {
        username: "[object String]",
        password: "[object String]",
        nickname: "[object String]"
    },
    hero_u_login: {
        username: "[object String]",
        password: "[object String]"
    }

};


module.exports = Params;