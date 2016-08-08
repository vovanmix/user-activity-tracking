var fs = require('fs');
var chai = require('chai');
chai.use(require('chai-fs'));
var expect = chai.expect;
var request = require('supertest');
var async = require('async');

var config = require('../src/app/config');
var getCurrentLogName = require('../src/app/services/track-service')
    .getCurrentLogName;
var removeFilesInDir = require('../src/app/services/storage-service')
    .removeFilesInDir;
var writeFilesForDates = require('./test-helper').writeFilesForDates;


describe('Routing', function() {

    var server;

    beforeEach(function(done) {
        server = require('../src/server');
        removeFilesInDir(config.storage, done);
    });
    afterEach(function() {
        server.close();
    });
    after(function(done) {
        removeFilesInDir(config.storage, done);
    });

    var activity_url = '/api/v1/activity';
    var stats_url = '/api/v1/stats';


    describe('/activity', function() {

        it('returns 200 OK', function(done) {

            request(server)
                .post(activity_url)
                .send({user_id: 4, session_id: 1})
                .end(function(err, res) {
                    if (err) { throw err; }

                    expect(res.status).to.equal(200);
                    done();
                });

        });


        it('forbids requests without full data', function(done) {
            request(server)
                .post(activity_url)
                .send()
                .end(function(err, res) {
                    if (err) { throw err; }

                    expect(res.status).to.equal(400);
                    done();
                });
        });


        it('creates a log file', function(done) {

            request(server)
                .post(activity_url)
                .send({user_id: 4, session_id: 1})
                .end(function(err, res) {
                    if (err) { throw err; }

                    expect(getCurrentLogName()).to.be
                        .a.file('file').and.not.empty('');

                    done();
                });
        });


        it('writes user data to a log file', function(done) {
            request(server)
                .post(activity_url)
                .send({user_id: 4, session_id: 1})
                .end(function(err, res) {
                    if (err) { throw err; }

                    var records = JSON.parse(
                        fs.readFileSync(getCurrentLogName())
                    );
                    var actual = records[4];
                    var expected = [1, 1];

                    expect(actual).to.eql(expected);

                    done();
                });
        });


        it('writes and collects stats', function(done) {
            async.parallel([
                function(callback) {
                    request(server)
                        .post(activity_url)
                        .send({user_id: 1, session_id: 10}).end(callback);
                },
                function(callback) {
                    request(server)
                        .post(activity_url)
                        .send({user_id: 2, session_id: 11}).end(callback);
                },
                function(callback) {
                    request(server)
                        .post(activity_url)
                        .send({user_id: 3, session_id: 12}).end(callback);
                },
                function(callback) {
                    request(server)
                        .post(activity_url)
                        .send({user_id: 4, session_id: 13}).end(callback);
                }
            ], function(err) {
                if (err) { throw err; }

                request(server)
                    .get(stats_url)
                    .send()
                    .end(function(err, res) {
                        var json_response = JSON.parse(res.body);

                        expect(json_response.num_sessions).to.equal(4);
                        expect(json_response.unique_users).to.equal(4);
                        expect(json_response.avg_sessions_per_user).to.equal(1);

                        done();
                    });
            });
        });


    });


    describe('/stats', function() {

        it('collects stats from the date range', function(done) {
            var data = {};
            var date5 = new Date();
            var date = new Date();
            date5.setFullYear(date.getFullYear() - 5);
            data[date5] = {1: [2, 2], 2: [1, 2], 3: [1, 1]};
            date = new Date();
            date.setFullYear(date.getFullYear() - 5);
            date.setMonth(date.getMonth() + 1);
            data[date] = {1: [2, 2], 2: [1, 2], 3: [1, 1]};
            writeFilesForDates(data);

            request(server)
                .get(stats_url)
                .send({
                    start_date: date5.toISOString(),
                    end_date: date.toISOString()
                })
                .end(function(err, res) {
                    var json_response = JSON.parse(res.body);

                    expect(json_response.num_sessions).to.equal(8);
                    expect(json_response.unique_users).to.equal(3);
                    expect(json_response.avg_sessions_per_user)
                        .to.equal(2.67);

                    done();
                });
        });


        it('collects stats for a user', function(done) {
            var data = {};
            data[new Date()] = {1: [2, 2], 2: [2, 2]};
            writeFilesForDates(data);

            request(server)
                .get(stats_url)
                .send({
                    user_id: 1
                })
                .end(function(err, res) {
                    var json_response = JSON.parse(res.body);

                    expect(json_response.num_sessions).to.equal(2);
                    expect(json_response.unique_users).to.equal(1);
                    expect(json_response.avg_sessions_per_user).to.equal(2);

                    done();
                });
        });

    });

});
