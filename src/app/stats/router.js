var router = require('express').Router();
var collectStats = require('../services/stat-service').collectStats;

var getStats = function(req, res) {

    var start_date = req.query.start_date;
    var end_date = req.query.end_date;
    var user_id = req.query.user_id;

    if (start_date) {
        start_date = new Date(start_date);
    }
    if (end_date) {
        end_date = new Date(end_date);
    }

    collectStats(start_date, end_date, user_id, function(results) {
        res.json({
            num_sessions: results.num_sessions,
            unique_users: results.unique_users,
            avg_sessions_per_user: results.avg_sessions_per_user
        });
    });

};

router.get('/stats', getStats);

module.exports = router;
