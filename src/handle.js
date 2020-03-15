const Params = require('./params.js');

class Handle {
    constructor(ctx) {
        this.ctx = ctx;
    }

    /**
     * 是否为正确参数, require & type
     * @param {*} interface_name    接口名
     */
    isCorrectParam(interface_name) {
        for (let param of Reflect.ownKeys(Params[interface_name])) {

            if (!Reflect.ownKeys(this.ctx.request.body).includes(param)) { // 是否存在
                this.handleError(param, "is require!");
                return false;
            } else {
                // 类型是否正确
                if (Reflect.apply(Object.prototype.toString, this.ctx.request.body[param], []) !== Params[interface_name][param]) {
                    this.handleError(param, "type error!");
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 统一返回错误信息
     * @param {*} param   参数名
     * @param {*} errMsg  错误信息
     */
    handleError(param, errMsg) {
        this.ctx.body = {
            code: -1,
            data: null,
            message: `${param} ${errMsg}`
        }
    }

}

module.exports = Handle;