// var customer = require('./customer-model');
var router = require('express').Router();

var trackActivity = function(req, res) {
    //todo
    //user_id, session_id

    res.json({
        message: 'todo'
    });
};

router.post('/activity', trackActivity);

module.exports = router;
