/**
 * Created by mike on 7/7/16.
 */
"use strict";

var db = require('../dao/databaseController');
var securityUtil = require('../util/securityUtil');
var errorUtil = require('../util/errorUtil');
var tokenPool = [];

function getUserIdByToken(token) {
    if (!token) return;
    return tokenPool[token];
} 

function addTokenByUserId(userId, token) {
    tokenPool[token] = userId;
}

var controller = {
    login: function (data, callback) {
        var userId = data.userId;
        var password = data.password;
        var msg = {
            err: null 
        };
        
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
        
        var msg = {
            err: null
        }
        if (userId) {
            tokenPool[userId] = undefined;
        }
        
        callback(msg);
    },
    
    topup: function (data, callback) {
        var userId = getUserIdByToken(data.token);
        var msg = {
            err: null
        };
        
        if (userId) {
            db.topUp(userId, data.payword, data.amount, function (err) {
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
        var msg = {
            err: null
        };
        
        if (userId) {
            db.withdraw(userId, data.payword, data.amount, function (err) {
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
        var msg = {
            err: null
        };
        
        db.ifUserExists(userId, function (exist) {
           if (exist) {
               msg.err = errorUtil.createError(6);
               callback(msg);
           } 
           else {
               if (!data.avatar) data.avatar = 0;
               db.register(data, function (err) {
                   msg.err = err;
                   callback(msg);
               })
           }
        });
    },
    
    getSelfInfo: function (data, callback) {
        var userId = getUserIdByToken(data.token);
        var msg = {
            err: null
        };

        if (userId) {
            db.findUser(userId, function (err, result) {
                msg.err = err;
                msg.info = result[0];
                callback(msg);
            })
        }
        else {
            msg.err = errorUtil.createError(5);
            callback(msg);
        }
    },
        
    getUserInfo: function (data, callback) {
        var userId = data.userId;
        var msg = {
            err: null,
            info : {}
        };

        db.findUser(userId, function (err, result) {
            msg.err = err;
            if (result.length > 0) {
                msg.info.username = result[0].username;
                callback(msg);
            }
            else {
                msg.err = errorUtil.createError(12);
                callback(msg);
            }
        });
    },


    updateUserInfo: function (data, callback) {
        var userId = getUserIdByToken(data.token);
        var msg = {
            err: null
        };
        
        if (userId && data.info) {
            if (data.info.password) {
                db.verifyLogin(userId, data.info.password, function (err) {
                    if (err) {
                        msg.err = err;
                        callback(msg);
                    }
                    else {
                        db.updateUser(userId, data.info, function (err) {
                            msg.err = err;
                            callback(msg);
                        })
                    }
                });
            }
            else {
                if (data.info.payword) {
                    db.verifyPay(userId, data.info.payword, function (err) {
                        if (err) {
                            msg.err = err;
                            callback(msg);
                        }
                        else {
                            db.updateUser(userId, data.info, function (err) {
                                msg.err = err;
                                callback(msg);
                            })
                        }
                    })
                }
                else {
                    db.updateUser(userId, data.info, function (err) {
                        msg.err = err;
                        callback(msg);
                    })
                }
            }
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
        
        var msg = {
            err: null
        };
       
        if (fromUserId) {
            db.ifUserExists(toUserId, function (exist) {
                if (exist) {
                    db.transfer(fromUserId, toUserId, payword, amount, function (err) {
                        msg.err = err;
                        callback(msg);
                    });
                }
                else {
                    msg.err = errorUtil.createError(12);
                    callback(msg);
                }
            });
        }
        else {
            msg.err = errorUtil.createError(5);
            callback(msg);
        }
    }
};

module.exports = controller;
