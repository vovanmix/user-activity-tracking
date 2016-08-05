
var initRouter = function(app) {
    app.use('/api/v1', require('./activity/router'));
    app.use('/api/v1', require('./stats/router'));

    app.use(require('./errors/not-found'));
};

module.exports = initRouter;
