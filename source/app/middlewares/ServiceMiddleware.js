module.exports = function ServiceMiddleware(req, res, next) {
    res.locals._service = {
        serviceIds: [],
    };
    next();
}