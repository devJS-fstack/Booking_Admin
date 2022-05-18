const JWT = require('jsonwebtoken');
const passport = require('passport');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../util/sequelizedb');
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();
const checkToken = async (req, res, next) => {
    next();
}
const passportMiddle = async (req, res, next) => {
    passport.initialize();
    passport.session();
    let user = await sequelize.query(`SELECT * FROM TaiKhoan,Customer WHERE Account = PhoneCustomer AND Account='${req.body.username}' COLLATE SQL_Latin1_General_CP1_CS_AS
    AND Password='${req.body.password}' COLLATE SQL_Latin1_General_CP1_CS_AS`, {
        raw: true,
        type: QueryTypes.SELECT,
    });
    passport.use(new LocalStrategy((username, password, done) => {
        if (user.length > 0) {
            return done(null, {
                username,
                password,
                active: true
            })
        }
        done(null, false)
    }))

    passport.serializeUser((user, done) => {
        console.log(user.username);
        return done(null, user.username);
    })

    passport.deserializeUser((username, done) => {
        console.log(`deserializeUser :::`, username);
        if (username == '0905783245') {
            return done(null, {
                username,
                active: true
            })
        }
        done(null, false);
    })


    next();
}


module.exports = { checkToken, passportMiddle }