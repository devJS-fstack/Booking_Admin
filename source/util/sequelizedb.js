const Sequelize = require('sequelize');

const sequelize = new Sequelize("QLTiemCatToc", "sa", "215531622", {
    host: "localhost",
    dialect: "mssql",
    logging: false,
})


// ------------------------------ Test connect -----------------------------------------
let connectData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// testConnect();
module.exports = { connectData, sequelize };