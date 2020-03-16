const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '127.0.0.1',   // 数据库地址
    user: 'victorykong',    // 数据库用户
    password: 'beenKong597@',   // 数据库密码
    database: 'hero-manage'  // 选中数据库
})


connection.connect(function (err) {
    if (err) {
        console.log('connect error', err.stack);
        return;
    }

    console.log("connect success");
});

const query = sql => {
    return new Promise((resolve, reject) => {

        connection.query(sql, (error, results, fields) => {
            if (error) {
                reject(error);
            }
            resolve(results);
        });
    })
};

module.exports = { query };
