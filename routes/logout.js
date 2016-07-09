/**
 * Created by mike on 7/8/16.
 */

var express = require('express');
var router = express.Router();
var controller = require('../controller/globalController');

//Logout router
router.get('/', function(req, res, next) {
    var body = req.body;
    console.log(body);
    
    controller.logout(body, function (msg) {
        res.end(msg);
    });
    
    res.render('display', {content: body});
});

module.exports = router;
