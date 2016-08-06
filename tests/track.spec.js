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


beforeEach(function() {
    removeFilesInDir(config.storage);
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
        expect(getCurrentLogName()).to.be.a.file().and.not.empty();
    });


    it('increases number of sessions per user', function() {
        //todo
    });


    it('does non increase number of sessions' +
        ' if called with the same session', function() {
        //todo
    });


    it('saves the last session id', function() {
        //todo
    });


});
