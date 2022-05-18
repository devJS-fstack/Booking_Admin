const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../../util/sequelizedb');


const TaiKhoan = sequelize.define('TaiKhoan', {
    Account: {
        type: DataTypes.STRING,
        allowNull: false,
        primary: true
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    IDRole: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: false,
})
console.log(TaiKhoan === sequelize.models.TaiKhoan);
module.exports = TaiKhoan;