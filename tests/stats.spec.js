var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-fs'));

var config = require('../src/app/config');

var collectStats = require('../src/app/services/stat-service').collectStats;
var getStatsForDate = require('../src/app/services/stat-service')
    .getStatsForDate;

describe('Collecting stats', function() {

    xit('gets one day stats for all users');


    xit('gets one day stats for only one user');


    xit('collects 2 days interval for all users');


    xit('collects 2 days interval for only one user');


    xit('collects 5 years interval for all users');


    xit('collects 5 years interval for only one user');


    xit('gets 1 month 5 years ago for all users');


    xit('works with many files for a big interval for all users');

});
