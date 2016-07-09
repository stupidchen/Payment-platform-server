/**
 * Created by mike on 7/7/16.
 */

var express = require('express');
var router = express.Router();
var controller = require('../controller/globalController');

//Login router
router.post('/login', function (req, res, next) {
    var body = req.body;
    controller.login(body, function (msg) {
        sendMessageByJson(res, msg);
    });
});

router.post('/logout', function (req, res, next) {
    var body = req.body;
    controller.logout(body, function (msg) {
        sendMessageByJson(res, msg);
    });
});

router.post('/topup', function (req, res, next) {
    var body = req.body;
    controller.topup(body, function (msg) {
        sendMessageByJson(res, msg);
    });
});

router.post('/withdraw', function (req, res, next) {
    var body = req.body;
    controller.topup(body, function (msg) {
        sendMessageByJson(res, msg);
    });
});

router.post('/register', function (req, res, next) {
    var body = req.body;
    controller.register(body, function (msg) {
        sendMessageByJson(res, msg);
    });
});

router.post('/getUserInfo', function (req, res, next) {
    var body = req.body;
    controller.getUserInfo(body, function (msg) {
        sendMessageByJson(res, msg);
    });
});

router.post('/updateUserInfo', function (req, res, next) {
    var body = req.body;
    controller.updateUserInfo(body, function (msg) {
        sendMessageByJson(res, msg);
    });
});

router.post('/transfer', function (req, res, next) {
    var body = req.body;
    controller.transfer(body, function (msg) {
        sendMessageByJson(res, msg);
    });
});

function sendMessageByJson(response, message) {
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(message));
}

module.exports = router;
