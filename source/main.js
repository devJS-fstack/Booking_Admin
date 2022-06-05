const express = require('express');
const app = express();
var morgan = require('morgan');
const path = require('path');
require('dotenv').config();
const port = process.env.PORT;

const route = require('./routes/index');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const nameUserMiddle = require('./app/middlewares/NameUserMiddleware')
const serviceMiddle = require('./app/middlewares/ServiceMiddleware');
const { connectData } = require('./util/sequelizedb');
const { sequelize } = require('./util/sequelizedb');
const { QueryTypes } = require('sequelize');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { checkToken, passportMiddle } = require('./app/middlewares/Authentication');

const { google } = require('googleapis');


app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
connectData();
const session = require('express-session');
const store = session.MemoryStore();
app.use(session({
    saveUninitialized: false,
    secret: process.env.KEY_SESSION,
    cookie: {
        maxAge: 1000 * 10 // 10s
    },
    store
}))

app.engine('hbs', handlebars({
    extname: '.hbs',
    helpers: {
        convertTime: (number) => {
            if (number > 9) return number;
            return `0${number}`
        },
        textAvt: (name) => {
            var arrName = name.split(' ');
            var first = arrName[0].split('')[0];
            var last = arrName[arrName.length - 1].split('')[0];
            return `${first}${last}`;
        },
        randomColor: () => {
            var randomColor = Math.floor(Math.random() * 16777215).toString(16);

            return randomColor;
        },
        formatDate: (date) => {
            var result = new Date(`${date}`);
            var day = result.getDate() > 9 ? result.getDate() : `0${result.getDate()}`;
            var month = result.getMonth() + 1 > 9 ? result.getMonth() + 1 : `0${result.getMonth() + 1}`;
            return `${day}-${month}-${result.getFullYear()}`
        },
        renderStatusCustomer: (status) => {
            if (status == 'Active') return 'Khóa tài khoản'
            else if (status == 'No Active') return 'Mở khóa tài khoản'
        },
        renderColorStatusCustomer: (status) => {
            if (status == 'Active') return ''
            else if (status == 'No Active') return 'red'
        }
    }
}))
app.use(express.urlencoded({
    extended: true,
}));
app.use(express.json());
app.set('view engine', 'hbs');
app.set("views", path.join(__dirname, 'resource/views'));
// app.use(morgan('combined'));
app.locals._user = {
    nameUser: '',
    arr: [],
}

app.locals._userRegis = {
    verifyNumber: 0,
    name: '',
    phone: '',
    email: '',
    password: '',
}
app.locals._service = {
    serviceIds: [],
}

// const { uploadFile } = require('./app/Models/UploadModal')
// uploadFile();
app.use(nameUserMiddle);
app.use(serviceMiddle);
//app.use(checkToken);
//app.use(passportMiddle);






route(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
