const RedisStore = require('./redis-store.js');
const shortid = require('shortid');

// session 签名
const session_signed = ['hero manage', 'victorykong', 'whz'];

// redis 配置
const redis_config = {
    redis: {
        port: 6379,
        host: "localhost",
        family: 4, // ip level
        password: "",
        db: 0
    }
}

const session_key = "hero_s_id";

// session 配置
const session_config = {
    key: session_key,
    maxAge: 30 * 1000,
    autoCommit: true, // add response header
    overwrite: false,
    httpOnly: true,
    signed: true,
    rolling: false, // 响应刷新有效期
    renew: false, // 即将结束刷新有效期
    sameSite: null,
    store: new RedisStore(redis_config), // 外部 store 存储
    genid: () => shortid.generate() // 生成唯一 key
};



module.exports = {
    session_signed,
    session_config,
    session_key
}