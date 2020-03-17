const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '127.0.0.1',   // 数据库地址
    user: 'victorykong',    // 数据库用户
    password: 'beenKong597@',   // 数据库密码
    database: 'hero_manage'  // 选中数据库
})


connection.connect(function (err) {
    if (err) {
        console.log('connect error', err.stack);
        return;
    }

    console.log("connect success");
});

/**
 * 
 * @param {*} sql 查询语句
 * @param {*} queryPlaceHolder 参数化
 */
const query = (sql, queryPlaceHolder = []) => {
    return new Promise((resolve, reject) => {

        connection.query(sql, queryPlaceHolder, (error, results, fields) => {
            if (error) {
                reject(error);
            }
            resolve(results);
        });
    })
};

module.exports = {
    query,
};
