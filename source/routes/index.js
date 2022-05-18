
const homeRouter = require('./home');
const regisRoute = require('./regis');
const bookingRoute = require('./booking');
const staffRoute = require('./staff');

function route(app) {

    // app.use('/regis', regisRoute);
    // app.use('/booking', bookingRoute);
    // app.use('/staff', staffRoute)
    app.use('/', staffRoute);
}




module.exports = route;