var fs = require('fs');
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
    //todo: make asynchronous with 25 parallel threads
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
 * @param {?string|?number=null} user_id
 * @param {?object=null} result
 */
var getStatsForDate = function(date, user_id, result) {
    var filename = getLogName(date);
    var data;
    try {
        data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    } catch (err) {
        return result;
    }

    if (!result) {
        result = {
            unique_users: 0,
            num_sessions: 0,
            avg_sessions_per_user: 0,
            users: []
        };
    }

    if (user_id) {
        user_id = user_id.toString();
        if (typeof data[user_id] !== 'undefined') {
            result.unique_users = 1;
            result.num_sessions += data[user_id][0];
        }
    } else {
        result = Object.keys(data).map(function(key) {
            return {key: key, data: data[key]};
        }).reduce(function(total, value) {
            if (total.users.indexOf(value.key) === -1) {
                total.users.push(value.key);
                total.unique_users++;
            }
            result.num_sessions += value.data[0];
            return result;
        }, result);
    }

    return result;
};


module.exports = {
    collectStats: collectStats,
    getStatsForDate: getStatsForDate
};
