/**
 * Created by mike on 7/7/16.
 */

var express = require('express');
var router = express.Router();
var controller = require('../controller/globalController');
var config = require('../util/configUtil');

router.post(config.interface.login, function (req, res, next) {
    var body = req.body;
    controller.login(body, function (msg) {
        sendMessageByJson(res, msg);
    });
});

router.post(config.interface.logout, function (req, res, next) {
    var body = req.body;
    controller.logout(body, function (msg) {
        sendMessageByJson(res, msg);
    });
});

router.post(config.interface.topup, function (req, res, next) {
    var body = req.body;
    controller.topup(body, function (msg) {
        sendMessageByJson(res, msg);
    });
});

router.post(config.interface.withdraw, function (req, res, next) {
    var body = req.body;
    controller.withdraw(body, function (msg) {
        sendMessageByJson(res, msg);
    });
});

router.post(config.interface.register, function (req, res, next) {
    var body = req.body;
    controller.register(body, function (msg) {
        sendMessageByJson(res, msg);
    });
});

router.post(config.interface.getOtherInfo, function (req, res, next) {
    var body = req.body;
    controller.getUserInfo(body, function (msg) {
        sendMessageByJson(res, msg);
    });
});

router.post(config.interface.getMyInfo, function (req, res, next) {
    var body = req.body;
    controller.getSelfInfo(body, function (msg) {
        sendMessageByJson(res, msg);
    });
});

router.post(config.interface.updateMyInfo, function (req, res, next) {
    var body = req.body;
    controller.updateUserInfo(body, function (msg) {
        sendMessageByJson(res, msg);
    });
});

router.post(config.interface.transfer, function (req, res, next) {
    var body = req.body;
    controller.transfer(body, function (msg) {
        sendMessageByJson(res, msg);
    });
});

function sendMessageByJson(response, message) {
    response.writeHead(200, {'Content-Type': 'application/json'});
    if (!message.err) {
        message.err = null;
    }
    response.end(JSON.stringify(message));
}

module.exports = router;
