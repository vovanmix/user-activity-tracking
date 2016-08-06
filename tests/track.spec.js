var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-fs'));

var dateFormat = require('dateformat');

var config = require('../src/app/config');
var removeFilesInDir = require('../src/app/services/storage-service')
    .removeFilesInDir;
var writeRecord = require('../src/app/services/track-service').writeRecord;
var getCurrentLogName = require('../src/app/services/track-service')
    .getCurrentLogName;


beforeEach(function(done) {
    removeFilesInDir(config.storage, done);
});

describe('Writing activity logs', function() {

    it('gets a correct current log name', function() {
        var actual = getCurrentLogName();
        var expected = config.storage + '/' +
            dateFormat(new Date(), 'yyyy-mm-dd') + '.json';
        expect(actual).to.be.equal(expected);
    });


    it('creates a new file when there is no file', function() {
        writeRecord(1, 2);
        expect(getCurrentLogName()).to.be.a.file('file').and.not.empty('');
    });


    it('increases the number of sessions per user', function() {
        writeRecord(1, 2);
        writeRecord(1, 3);
        writeRecord(1, 4);
        writeRecord(2, 5);
        var records = JSON.parse(fs.readFileSync(getCurrentLogName()));
        var actual = {
            1: records[1][0],
            2: records[2][0]
        };
        var expected = {1: 3, 2: 1};

        expect(actual).to.eql(expected);
    });


    it('does non increase the number of sessions' +
        ' if called with the same session', function() {
        writeRecord(1, 2);
        writeRecord(1, 2);
        writeRecord(1, 2);
        var records = JSON.parse(fs.readFileSync(getCurrentLogName()));
        var actual = {
            1: records[1][0]
        };
        var expected = {1: 1};

        expect(actual).to.eql(expected);
    });


    it('saves the last session id', function() {
        writeRecord(1, 2);
        writeRecord(2, 2);
        writeRecord(1, 3);
        var records = JSON.parse(fs.readFileSync(getCurrentLogName()));
        var actual = {
            1: records[1][1],
            2: records[2][1]
        };
        var expected = {1: 3, 2: 2};

        expect(actual).to.eql(expected);
    });

});
