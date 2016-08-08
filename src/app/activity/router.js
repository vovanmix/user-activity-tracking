// var customer = require('./customer-model');
var router = require('express').Router();
var writeRecord = require('../services/track-service').writeRecord;

var trackActivity = function(req, res) {

    if (!req.body.user_id || !req.body.session_id) {
        return res.status(400).json({
            error: 'wrong data'
        });
    }

    var user_id = req.body.user_id;
    var session_id = req.body.session_id;

    writeRecord(user_id, session_id, function() {
        res.json({
            message: 'done'
        });
    });

};

router.post('/activity', trackActivity);

module.exports = router;
