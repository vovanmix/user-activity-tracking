var config = require('../config');
var dateFormat = require('dateformat');

var writeRecord = function(user_id, session_id) {
    // config.storage;
    //todo
};

var getCurrentLogName = function() {
    return config.storage +
        '/' + dateFormat(new Date(), 'yyyy-mm-dd') + '.json';
};


module.exports = {
    writeRecord: writeRecord,
    getCurrentLogName: getCurrentLogName
};
