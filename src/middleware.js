const Params = require('./params.js');

const Error_result = { // 错误信息对象
    code: -1,
    data: null,
};

// 校验参数
const validateParams = () => {
    return async (ctx, next) => {

        const url = ctx.request.url.substr(1); // 接口
        const body = ctx.request.body; // 请求体参数

        if (JSON.stringify(ctx.request.body) !== "{}") {
            for (let param of Reflect.ownKeys(Params[url])) {
                if (!Reflect.ownKeys(body).includes(param)) { // 必填
                    return ctx.body = { ...Error_result, message: `${param} is require!` };
                } else {
                    if (Reflect.apply(Object.prototype.toString, body[param], []) !== Params[url][param]) { // 类型是否正确
                        return ctx.body = { ...Error_result, message: `${param} type error!` };
                    }
                }
            }
        }

        await next();
    }
}


module.exports = {
    validateParams
}