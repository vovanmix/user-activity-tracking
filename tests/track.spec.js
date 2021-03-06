var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-fs'));

var dateFormat = require('dateformat');
var async = require('async');

var config = require('../src/app/config');
var removeFilesInDir = require('../src/app/services/storage-service')
    .removeFilesInDir;
var writeRecord = require('../src/app/services/track-service').writeRecord;
var getCurrentLogName = require('../src/app/services/track-service')
    .getCurrentLogName;


describe('Writing activity logs', function() {

    beforeEach(function(done) {
        removeFilesInDir(config.storage, done);
    });

    after(function(done) {
        removeFilesInDir(config.storage, done);
    });


    it('gets a correct current log name', function() {
        var actual = getCurrentLogName();
        var expected = config.storage + '/' +
            dateFormat(new Date(), 'yyyy-mm-dd') + '.json';
        expect(actual).to.be.equal(expected);
    });


    it('creates a new file when there is no file', function(done) {
        writeRecord(1, 2, function() {
            expect(getCurrentLogName()).to.be.a.file('file').and.not.empty('');
            done();
        });
    });


    it('increases the number of sessions per user', function(done) {
        async.parallel([
            function(callback) { writeRecord(1, 2, callback); },
            function(callback) { writeRecord(1, 3, callback); },
            function(callback) { writeRecord(1, 4, callback); },
            function(callback) { writeRecord(2, 5, callback); }
        ],
            function(err) {
                if (err) { throw err; }
                var records = JSON.parse(fs.readFileSync(getCurrentLogName()));
                var actual = {
                    1: records[1][0],
                    2: records[2][0]
                };
                var expected = {1: 3, 2: 1};

                expect(actual).to.eql(expected);
                done();
            }
        );
    });


    it('does non increase the number of sessions' +
        ' if called with the same session', function(done) {
        async.parallel([
            function(callback) { writeRecord(1, 2, callback); },
            function(callback) { writeRecord(1, 2, callback); },
            function(callback) { writeRecord(1, 2, callback); }
        ],
            function(err) {
                if (err) { throw err; }
                var records = JSON.parse(fs.readFileSync(getCurrentLogName()));
                var actual = {
                    1: records[1][0]
                };
                var expected = {1: 1};

                expect(actual).to.eql(expected);
                done();
            }
        );
    });


    it('saves the last session id', function(done) {
        async.parallel([
            function(callback) { writeRecord(1, 2, callback); },
            function(callback) { writeRecord(2, 2, callback); },
            function(callback) { writeRecord(1, 3, callback); }
        ],
            function(err) {
                if (err) { throw err; }
                var records = JSON.parse(fs.readFileSync(getCurrentLogName()));
                var actual = {
                    1: records[1][1],
                    2: records[2][1]
                };
                var expected = {1: 3, 2: 2};

                expect(actual).to.eql(expected);
                done();
            }
        );
    });


    it('works ok with race conditions', function(done) {
        async.parallel([
            function(callback) { writeRecord(1, 1, callback); },
            function(callback) { writeRecord(2, 2, callback); },
            function(callback) { writeRecord(3, 3, callback); },
            function(callback) { writeRecord(4, 4, callback); },
            function(callback) { writeRecord(5, 5, callback); },
            function(callback) { writeRecord(6, 6, callback); },
            function(callback) { writeRecord(7, 7, callback); },
            function(callback) { writeRecord(8, 8, callback); },
            function(callback) { writeRecord(9, 9, callback); },
            function(callback) { writeRecord(10, 10, callback); }
        ],
            function(err) {
                if (err) { throw err; }
                var actual = JSON.parse(fs.readFileSync(getCurrentLogName()));
                var expected = {
                    1: [1, 1],
                    2: [1, 2],
                    3: [1, 3],
                    4: [1, 4],
                    5: [1, 5],
                    6: [1, 6],
                    7: [1, 7],
                    8: [1, 8],
                    9: [1, 9],
                    10: [1, 10]
                };

                expect(actual).to.eql(expected);
                done();
            }
        );
    });

});
