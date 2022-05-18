module.exports = function NameUserMiddleware(req, res, next) {
    res.locals._user = {
        isLogin: false,
        nameUser: 'Khách hàng',
        phoneUser: '',
        arr: [],
        service: 1,
    };
    next();
}