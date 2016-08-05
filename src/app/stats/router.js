// var customer = require('./customer-model');
var router = require('express').Router();

var getStats = function(req, res) {
    //todo
    // start_date, end_date, user_id

    res.json({
        message: 'todo'
    });
};

router.get('/stats', getStats);

module.exports = router;
