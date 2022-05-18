const sql = require('mssql');
const config = require('../database/dbconfig');


async function getTaiKhoan() {
    try {
        await sql.connect(config);
        const taiKhoan = await sql.query`select * from TaiKhoan`
        return taiKhoan.recordsets;
    } catch (err) {
        console.log(err);
    }
}


module.exports = { getTaiKhoan: getTaiKhoan };