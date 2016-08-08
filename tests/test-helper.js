var fs = require('fs');
var getLogName = require('../src/app/services/track-service').getLogName;

function writeFilesForDates(dates) {
    for (var date in dates) {
        if (dates.hasOwnProperty(date)) {
            var filename = getLogName(date);
            fs.writeFileSync(filename, JSON.stringify(dates[date]), 'utf8');
        }
    }
}

module.exports = {
    writeFilesForDates: writeFilesForDates
};
