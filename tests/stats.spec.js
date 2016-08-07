var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-fs'));
var fs = require('fs');

var config = require('../src/app/config');

var removeFilesInDir = require('../src/app/services/storage-service')
    .removeFilesInDir;
var collectStats = require('../src/app/services/stat-service').collectStats;
var getStatsForDate = require('../src/app/services/stat-service')
    .getStatsForDate;
var getLogName = require('../src/app/services/track-service').getLogName;


function writeFilesForDates(dates) {
    for (var date in dates) {
        if (dates.hasOwnProperty(date)) {
            var filename = getLogName(date);
            fs.writeFileSync(filename, JSON.stringify(dates[date]), 'utf8');
        }
    }
}

beforeEach(function(done) {
    removeFilesInDir(config.storage, done);
});

after(function(done) {
    removeFilesInDir(config.storage, done);
});

describe('Collecting stats', function() {

    it('gets one day stats for all users', function(done) {
        var data = {};
        data[new Date()] = {1: [2, 2], 2: [2, 2]};
        writeFilesForDates(data);

        getStatsForDate(new Date(), null, function(actual) {
            var expected = {
                num_sessions: 4,
                unique_users: 2,
                avg_sessions_per_user: 2
            };
            expect(actual).to.eql(expected);
            done();
        });
    });


    it('gets one day stats for only one user', function(done) {
        var data = {};
        data[new Date()] = {1: [2, 2], 2: [2, 2]};
        writeFilesForDates(data);

        getStatsForDate(new Date(), 1, function(actual) {
            var expected = {
                num_sessions: 2,
                unique_users: 1,
                avg_sessions_per_user: 2
            };
            expect(actual).to.eql(expected);
            done();
        });
    });


    it('collects 2 days interval for all users', function(done) {
        var data = {};
        data[new Date()] = {1: [2, 2], 2: [2, 2]};
        var date = new Date();
        date.setDate(date.getDate() - 1);
        data[date] = {1: [2, 2], 2: [1, 2], 3: [1, 1]};
        writeFilesForDates(data);

        collectStats(date, new Date(), null, function(actual) {
            var expected = {
                num_sessions: 8,
                unique_users: 3,
                avg_sessions_per_user: 2.66
            };
            expect(actual).to.eql(expected);
            done();
        });
    });


    it('collects 2 days interval for only one user', function(done) {
        var data = {};
        data[new Date()] = {1: [2, 2], 2: [2, 2]};
        var date = new Date();
        date.setDate(date.getDate() - 1);
        data[date] = {1: [2, 2], 2: [1, 2], 3: [1, 1]};
        writeFilesForDates(data);

        collectStats(date, new Date(), 2, function(actual) {
            var expected = {
                num_sessions: 3,
                unique_users: 1,
                avg_sessions_per_user: 3
            };
            expect(actual).to.eql(expected);
            done();
        });
    });


    it('collects 5 years interval for all users', function(done) {
        var data = {};
        data[new Date()] = {1: [2, 2], 2: [2, 2]};
        var date = new Date();
        date.setFullYear(date.getFullYear() - 5);
        data[date] = {1: [2, 2], 2: [1, 2], 3: [1, 1]};
        writeFilesForDates(data);

        collectStats(null, null, null, function(actual) {
            var expected = {
                num_sessions: 8,
                unique_users: 3,
                avg_sessions_per_user: 2.66
            };
            expect(actual).to.eql(expected);
            done();
        });
    });


    it('gets 1 month 5 years ago for all users', function(done) {
        var data = {};
        var date = new Date();
        date.setFullYear(date.getFullYear() - 5);
        data[date] = {1: [2, 2], 2: [1, 2], 3: [1, 1]};
        date = new Date();
        date.setFullYear(date.getFullYear() - 5);
        date.setMonth(date.getMonth() + 1);
        data[date] = {1: [2, 2], 2: [1, 2], 3: [1, 1]};
        writeFilesForDates(data);

        collectStats(null, date, null, function(actual) {
            var expected = {
                num_sessions: 8,
                unique_users: 3,
                avg_sessions_per_user: 2.66
            };
            expect(actual).to.eql(expected);
            done();
        });
    });


    it('works ok with no results for only one user', function(done) {
        var data = {};
        data[new Date()] = {1: [2, 2], 2: [2, 2]};
        var date = new Date();
        date.setDate(date.getDate() - 1);
        data[date] = {1: [2, 2], 2: [1, 2], 3: [1, 1]};
        writeFilesForDates(data);

        collectStats(date, new Date(), 22, function(actual) {
            var expected = {
                num_sessions: 0,
                unique_users: 0,
                avg_sessions_per_user: 0
            };
            expect(actual).to.eql(expected);
            done();
        });
    });


    it('works ok with no results for all users', function(done) {
        var data = {};
        data[new Date()] = {};
        var date = new Date();
        date.setDate(date.getDate() - 1);
        data[date] = {};
        writeFilesForDates(data);

        collectStats(date, new Date(), null, function(actual) {
            var expected = {
                num_sessions: 0,
                unique_users: 0,
                avg_sessions_per_user: 0
            };
            expect(actual).to.eql(expected);
            done();
        });
    });


    it('works ok with non-existing log files', function(done) {
        var date = new Date();
        date.setDate(date.getDate() - 1);

        collectStats(date, new Date(), null, function(actual) {
            var expected = {
                num_sessions: 0,
                unique_users: 0,
                avg_sessions_per_user: 0
            };
            expect(actual).to.eql(expected);
            done();
        });
    });


    it('forbids to look back for more than 5 years', function(done) {
        var data = {};
        data[new Date()] = {1: [2, 2], 2: [2, 2]};
        var date = new Date();
        date.setFullYear(date.getFullYear() - 6);
        data[date] = {1: [2, 2], 2: [1, 2], 3: [1, 1]};
        writeFilesForDates(data);

        collectStats(date, null, null, function(actual) {
            var expected = {
                num_sessions: 4,
                unique_users: 2,
                avg_sessions_per_user: 2
            };
            expect(actual).to.eql(expected);
            done();
        });
    });


    it('forbids to get stats for the future', function(done) {
        var data = {};
        data[new Date()] = {1: [2, 2], 2: [2, 2]};
        var date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        data[date] = {1: [2, 2], 2: [1, 2], 3: [1, 1]};
        writeFilesForDates(data);

        collectStats(new Date(), data, null, function(actual) {
            var expected = {
                num_sessions: 4,
                unique_users: 2,
                avg_sessions_per_user: 2
            };
            expect(actual).to.eql(expected);
            done();
        });
    });


    it('works ok with many files for a big interval for all users',
        function(done) {
            var data = {};
            var date;
            for (var i = 0; i < 365; i++) {
                date = new Date();
                date.setDate(date.getDate() - i);
                data[date] = {1: [2, 2], 2: [1, 2], 3: [1, 1]};
            }
            writeFilesForDates(data);

            collectStats(null, null, null, function(actual) {
                var expected = {
                    num_sessions: 1460,
                    unique_users: 3,
                    avg_sessions_per_user: 486.66
                };
                expect(actual).to.eql(expected);
                done();
            });
        }
    );

});
