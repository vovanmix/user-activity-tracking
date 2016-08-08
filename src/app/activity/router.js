// var customer = require('./customer-model');
var router = require('express').Router();
var writeRecord = require('../services/track-service').writeRecord;

var trackActivity = function(req, res) {

    writeRecord('1', '2', function() {
        res.json({
            message: 'todo'
        });
    });

};

router.post('/activity', trackActivity);

module.exports = router;
