var config = require('../config');
var getLogName = require('./track-service').getLogName;

const YEARS_BACK_MAX = 5;

/**
 * Collects stats
 * @param {?Date} date_from
 * @param {?Date} date_to
 * @param {?string|number} user_id
 * @param {function} cb
 */
var collectStats = function(date_from, date_to, user_id, cb) {
    // config.storage;
    //todo
    config = '';
    date_from = '';
    date_to = '';
    user_id = '';

    if (!date_from) {
        date_from = new Date();
        date_from.setFullYear(date_from.getFullYear() - YEARS_BACK_MAX);
    }
    if (!date_to) {
        date_to = new Date();
    }

    for (var d = date_from; d <= date_to; d.setDate(d.getDate() + 1)) {
        getStatsForDate(new Date(d), user_id, cb);
    }

    return {
        num_sessions: 0,
        unique_users: 0,
        avg_sessions_per_user: 0
    };
};


/**
 * Collects stats for one day
 * @param {Date} date
 * @param {?string|number} user_id
 * @param {function} cb
 */
var getStatsForDate = function(date, user_id, cb) {
    //todo
    cb();
};


module.exports = {
    collectStats: collectStats,
    getStatsForDate: getStatsForDate
};
