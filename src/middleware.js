const Params = require('./params.js');
const utils = require('./utils.js');

const Error_result = { // 错误信息对象
    code: -1,
    data: null,
    message: "server error!"
};


// 校验参数
const validateParams = () => {
    return async (ctx, next) => {

        let reqParams, url = ctx.request.url.substr(1); // 请求参数 & 接口
        const method = ctx.request.method; // 请求方法


        if (method === "GET") {
            if (ctx.request.method === "GET" && url.includes("?")) { // get 请求带参数，需格式化拿到 url
                url = utils.formatGetUrl(url);
            }
            reqParams = Object.fromEntries(new URLSearchParams(ctx.request.url.split("?")[1])); // get 请求参数兼容需转对象

        } else {
            reqParams = ctx.request.body;
        }

        if (Reflect.ownKeys(Params).includes(url)) { // 判断该 url 是否需要校验
            for (let param of Reflect.ownKeys(Params[url])) {
                if (!Reflect.ownKeys(reqParams).includes(param)) { // 必填
                    return ctx.body = { ...Error_result, message: `${param} is require!` };
                } else {
                    if (Reflect.apply(Object.prototype.toString, reqParams[param], []) !== Params[url][param]) { // 类型是否正确
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