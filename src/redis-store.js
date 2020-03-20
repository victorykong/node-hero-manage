const Redis = require('ioredis');

/**
 * 操作 redis 的 Store 类
 */
class RedisStore {
    constructor(config) {
        this.redis = new Redis(config); 
    }


    /**
     * 通过键获取会话对象
     * @param {*} key 存储的键
     */
    async get(key) {
        const data = await this.redis.get(`SESSION:${key}`);  // return Promise instance
        return JSON.parse(data);
    }

    /**
     * 设置密钥的会话对象
     * @param {*} key    存储的键
     * @param {*} sess   存储的数据
     * @param {*} maxAge 过期时间（以毫秒为单位）
     */
    async set(key, sess, maxAge) {
        await this.redis.set(
            `SESSION:${key}`,
            JSON.stringify(sess),
            'EX', // 将键的过期时间设置为 seconds 秒
            maxAge / 1000 // 1 ==> 0.001
        )
    }

    /**
     * 销毁密钥会话
     * @param {*} key 存储的键
     */
    async destroy(key) {
        return await this.redis.del(`SESSION:${key}`);
    }

}



module.exports = RedisStore;