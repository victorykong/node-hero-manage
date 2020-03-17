const Error_result = { // 错误信息对象
    code: -1,
    data: null,
    message: "server error!"
};

/**
 * try catch 增强函数
 * @param {*} ctx 调度控制器
 * @param {*} controller  逻辑代码
 */
const wrapper = ctx => async controller => {
    try {
        await controller()
    } catch (error) {
        // 切勿泄露太多 db 关键信息
        // ctx.body = { ...Error_result, message: error.sqlMessage || "sql query error!" }
        ctx.body = { ...Error_result, message: "sql query error!" }
    }
}

module.exports = wrapper;