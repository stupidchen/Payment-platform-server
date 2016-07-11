/**
 * Created by mike on 7/7/16.
 */
var db = require('../dao/databaseController');
var securityUtil = require('../util/securityUtil');
var errorUtil = require('../util/errorUtil');
var tokenPool = [];

function getUserIdByToken(token) {
    if (token) return;
    return tokenPool.indexOf(token);
} 

function addTokenByUserId(userId, token) {
    tokenPool[userId] = token;
}

var controller = {
    login: function (data, callback) {
        var userId = data.userId;
        var password = data.password;
        var msg = {};
        
        if (!(userId && password)) {
            msg.err = errorUtil.createError(1);
            callback(msg);
        }
        else {
            db.verifyLogin(userId, password, function (err) {
                msg = {
                    err: err
                };
                
                if (!err) {
                    securityUtil.generateToken(function (token) {
                        msg.token = token;
                        addTokenByUserId(userId, token);
                        callback(msg);
                    });
                }
                else {
                    callback(msg);
                }
            });
        }
    },

    logout: function (data, callback) {
        var userId = getUserIdByToken(data.token);
        
        if (userId) {
            tokenPool[userId] = undefined;
        }
    },
    
    topup: function (data, callback) {
        var userId = getUserIdByToken(data.token);
        var msg = {};
        
        if (userId) {
            db.topUp(data.userId, data.payword, data.amount, function (err) {
                msg.err = err;
                callback(msg);
            });
        }
        else {
            msg.err = errorUtil.createError(5);
            callback(msg);
        }
    },
    
    withdraw: function (data, callback) {
        var userId = getUserIdByToken(data.token);
        var msg = {};
        
        if (userId) {
            db.withdraw(data.userId, data.payword, data.amount, function (err) {
                msg.err = err;
                callback(msg);
            });
        }
        else {
            msg.err = errorUtil.createError(5);
            callback(msg);
        }
    },

    register: function (data, callback) {
        var userId = data.userId;
        
        var msg = {};
        db.ifUserExists(userId, function (exist) {
           if (exist) {
               msg.err = errorUtil.createError(6);
               callback(msg);
           } 
           else {
               db.register(data, function (err) {
                   msg.err = err;
                   callback(msg);
               })
           }
        });
    },
    
    getUserInfo: function (data, callback) {
        var userId = getUserIdByToken(data.token);

        var msg = {};
        if (userId) {
            db.findUser(userId, function (err, result) {
                msg.err = err;
                msg.info = result;
                callback(msg);
            })
        }
        else {
            msg.err = errorUtil.createError(5);
            callback(msg);
        }
    },

    updateUserInfo: function (data, callback) {
        var userId = getUserIdByToken(data.token);

        var msg = {};
        if (userId) {
            db.updateUser(userId, data.info, function (err, result) {
                msg.err = err;
                callback(msg);
            })
        }
        else {
            msg.err = errorUtil.createError(5);
            callback(msg);
        }
    },
    
    transfer: function (data, callback) {
        var fromUserId = getUserIdByToken(data.token);
        var toUserId = data.userId;
        var amount = data.amount;
        var payword = data.payword;
        
        var msg = {};
        db.transfer(fromUserId, toUserId, payword, amount, function (err) {
            msg.err = err;
            callback(msg);
        });
    }
};

module.exports = controller;
