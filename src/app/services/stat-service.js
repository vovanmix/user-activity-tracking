var fs = require('fs');
var _ = require('lodash');
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
    //todo: make asynchronous with up to 25 parallel threads
    //todo: more than 25 parallel threads can cause memory problems

    var date_from_min = new Date();
    date_from_min.setHours(0);
    date_from_min.setMinutes(0);
    date_from_min.setSeconds(0);
    date_from_min.setFullYear(date_from_min.getFullYear() - YEARS_BACK_MAX);
    var date_to_max = new Date();
    date_to_max.setHours(23);
    date_to_max.setMinutes(59);
    date_to_max.setSeconds(59);
    if (!date_from || date_from < date_from_min) {
        date_from = date_from_min;
    }
    if (!date_to || date_to > date_to_max) {
        date_to = date_to_max;
    }

    //todo: make it storage agnostic, create a filesystem adapter
    //todo: and SQL and NoSQL and redis and mock adapters
    //todo: that can be interchangeable
    var result = {
        unique_users: 0,
        num_sessions: 0,
        users: []
    };
    for (var d = date_from; d <= date_to; d.setDate(d.getDate() + 1)) {
        result = getStatsForDate(new Date(d), user_id, result);
    }

    var avg = 0;
    if (result.unique_users > 0) {
        avg = _.round(result.num_sessions / result.unique_users, 2);
    }

    cb({
        num_sessions: result.num_sessions,
        unique_users: result.unique_users,
        avg_sessions_per_user: avg
    });
};


/**
 * Collects stats for one day
 * @param {Date} date
 * @param {?string|?number=null} user_id
 * @param {?object=null} result
 */
var getStatsForDate = function(date, user_id, result) {

    if (!result) {
        result = {
            unique_users: 0,
            num_sessions: 0,
            users: []
        };
    }

    var filename = getLogName(date);
    var data;
    try {
        data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    } catch (err) {
        return result;
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
