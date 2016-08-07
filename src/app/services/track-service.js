var config = require('../config');
var fs = require('fs');
var dateFormat = require('dateformat');
var lockFile = require('lockfile');


/**
 * Writes a track record in asynchronous manner
 * @param {string|number} user_id
 * @param {string|number} session_id
 * @param {function} cb
 */
var writeRecord = function(user_id, session_id, cb) {
    var filename = getCurrentLogName();
    var records = {};
    var LOCK_SETTINGS = {wait: 100, retries: 10, retryWait: 100};
    lockFile.lock(filename + '.lock', LOCK_SETTINGS, function(err) {
        if (err) {
            process.stdout.write('Error locking file');
        }
        fs.exists(filename, function(exists) {
            if (exists) {
                fs.readFile(filename, function(err, data) {
                    if (err) {
                        records = {};
                    } else {
                        records = JSON.parse(data);
                    }
                    updateAndWrite(records, user_id, session_id, filename, cb);
                });
            } else {
                fs.writeFile(filename, '', function(err) {
                    if (err) {
                        process.stdout.write('Error creating file');
                    }
                    records = {};
                    updateAndWrite(records, user_id, session_id, filename, cb);
                });
            }
        });
    });
};


/**
 * Writes a track record synchronously
 * @param {string|number} user_id
 * @param {string|number} session_id
 */
var writeRecordSync = function(user_id, session_id) {
    var filename = getCurrentLogName();
    var records = {};
    try {
        if (fs.existsSync(filename)) {
            lockFile.lockSync(filename + '.lock');
            records = JSON.parse(fs.readFileSync(filename));
        }
    } catch (e) {
        fs.writeFileSync(filename, '');
        lockFile.lockSync(filename + '.lock');
        records = {};
    }
    records = updateRecords(records, user_id, session_id);

    fs.writeFileSync(filename, JSON.stringify(records), 'utf8');
    lockFile.unlockSync(filename + '.lock');
};


/**
 * Updates the records array and writes it back to the file
 * @param {object} records
 * @param {string|number} user_id
 * @param {string|number} session_id
 * @param {string} filename
 * @param {function} cb
 */
var updateAndWrite = function(records, user_id, session_id, filename, cb) {
    records = updateRecords(records, user_id, session_id);
    fs.writeFile(filename, JSON.stringify(records), 'utf8', function(err) {
        if (err) {
            process.stdout.write('Error writing file');
        }
        lockFile.unlock(filename + '.lock', function(err) {
            if (err) {
                process.stdout.write('Error unlocking file');
            }
            if (cb) {
                cb();
            }
        });
    });
};


/**
 * Updates the records array with info about new user visit
 * and returns the updated array
 * @param {array} records
 * @param {string|number} user_id
 * @param {string|number} session_id
 */
var updateRecords = function(records, user_id, session_id) {
    user_id = user_id.toString();
    if (typeof records[user_id] === 'undefined') {
        records[user_id] = [0, 0];
    }
    if (records[user_id][1] !== session_id) {
        records[user_id][0]++;
        records[user_id][1] = session_id;
    }
    return records;
};


/**
 * Gets the log file name for today
 */
var getCurrentLogName = function() {
    return getLogName(new Date());
};


/**
 * Gets the log file name based on date
 * @param {Date} date
 */
var getLogName = function(date) {
    return config.storage +
        '/' + dateFormat(date, 'yyyy-mm-dd') + '.json';
};


module.exports = {
    writeRecord: writeRecord,
    writeRecordSync: writeRecordSync,
    getCurrentLogName: getCurrentLogName,
    getLogName: getLogName
};
