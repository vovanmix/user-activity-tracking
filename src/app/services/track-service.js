var config = require('../config');
var fs = require('fs');
var dateFormat = require('dateformat');

var writeRecord = function(user_id, session_id) {
    user_id = user_id.toString();
    var filename = getCurrentLogName();
    var records = {};
    try {
        if (fs.existsSync(filename)) {
            records = JSON.parse(fs.readFileSync(filename));
        }
    } catch (e) {
        records = {};
    }
    if (typeof records[user_id] === 'undefined') {
        records[user_id] = [0, 0];
    }
    records[user_id][0] ++;
    records[user_id][1] = session_id;
    fs.writeFileSync(filename, JSON.stringify(records), 'utf8');
};

var getCurrentLogName = function() {
    return config.storage +
        '/' + dateFormat(new Date(), 'yyyy-mm-dd') + '.json';
};


module.exports = {
    writeRecord: writeRecord,
    getCurrentLogName: getCurrentLogName
};
