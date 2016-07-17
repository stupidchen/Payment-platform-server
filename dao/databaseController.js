/**
 * Created by mike on 7/8/16.
 */
var mysql = require('mysql');
var errorUtil = require('../util/errorUtil');
var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '12345687',
    database: 'xcccf_pay',
});

var databaseController = {
    verifyLogin: function (userId, password, callback) {
        connection.query('SELECT * FROM users WHERE userId = ? AND password = ?',
            [userId, password],
            function (err, result) {
                if (err) {
                    callback(errorUtil.createError(2, err));
                }
                else {
                    if (result[0] && result[0].password === password) {
                        callback();
                    }
                    else {
                        callback(errorUtil.createError(1));
                    }
                }
            });
    },

    verifyPay: function (userId, payword, callback) {
        connection.query('SELECT * FROM users WHERE userId = ? AND payword = ?',
            [userId, payword],
            function (err, result) {
                if (err) {
                    callback(errorUtil.createError(2, err));
                }
                else {
                    if (result[0] && result[0].payword === payword) {
                        callback();
                    }
                    else {
                        callback(errorUtil.createError(7));
                    }
                }
            });
    },

    verifyCash: function (userId, amount, callback) {
        databaseController.findUser(userId, function (err, result) {
            if (err) {
                callback(err);
            }
            else {
                if (result[0] && result[0].money >= amount) {
                    callback();
                }
                else {
                    callback(errorUtil.createError(8));
                }
            }
        });
    },
    
    findUser: function (userId, callback) {
        connection.query('SELECT * FROM users WHERE userId = ?', userId, callback);
    },
    
    //TOCHECK
    updateUser: function (userId, info, callback) {
        if (info.avatar) {
            connection.query('UPDATE users t SET t.avatar = ? WHERE userId = ?',
                [info.avatar, userId], callback);
            return;
        }
        if (info.username) {
            connection.query('UPDATE users t SET t.username = ? WHERE userId = ?',
                [info.username, userId], callback);
            return;
        }
        if (info.newPassword) {
            connection.query('UPDATE users t SET t.password = ? WHERE userId = ?',
                [info.newPassword, userId], callback);
            return;
        }
        if (info.newPayword) {
            connection.query('UPDATE users t SET t.payword = ? WHERE userId = ?',
                [info.newPayword, userId], callback);
            return;
        }
        if (info.sex) {
            connection.query('UPDATE users t SET t.sex = ? WHERE userId = ?',
                [info.sex, userId], callback);
            return;
        }
        if (info.description) {
            connection.query('UPDATE users t SET t.description = ? WHERE userId = ?',
                [info.description, userId], callback);
            return;
        }
        if (info.email) {
            connection.query('UPDATE users t SET t.email = ? WHERE userId = ?',
                [info.email, userId], callback);
            return;
        }
    },

    
    transfer: function (fromUserId, toUserId, payword, amount, callback) {
        databaseController.verifyPay(fromUserId, payword, function(err) {
            if (err) {
                callback(err);
                return;
            }
            databaseController.verifyCash(fromUserId, amount, function (err) {
                if (err) {
                    callback(err);
                    return;
                }
                connection.query('UPDATE users t SET t.money = t.money - ? WHERE userId = ?', [amount, fromUserId], function (err, result) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    connection.query('UPDATE users t SET t.money = t.money + ? WHERE userId = ?', [amount, toUserId], function (err, result) {
                        if (err) {
                            connection.query('UPDATE users t SET t.money = t.money + ? WHERE userId = ?', [amount, fromUserId], function (err) {
                                if (err) {
                                    callback(errorUtil.createError(10));
                                    return;
                                }
                                callback(errorUtil.createError(9));
                            });
                            return;
                        }
                        callback();
                    });
                });
            });
        });
    },
    
    topUp: function (userId, payword, amount, callback) {
        databaseController.verifyPay(userId, payword, function (err) {
            if (err) {
                callback(err);
                return; 
            }
            connection.query('UPDATE users t SET t.money = t.money + ? WHERE userId = ?', [amount, userId], callback);
        });
    },

    withdraw: function (userId, payword, amount, callback) {
        databaseController.verifyPay(userId, payword, function (err) {
            if (err) {
                callback(err);
                return;
            }
            databaseController.verifyCash(userId, amount, function (err) {
                if (err) {
                    callback(err);
                    return;
                }
                connection.query('UPDATE users t SET t.money = t.money - ? WHERE userId = ?', [amount, userId], callback);
            });
        });
    },
    
    //TOCHECK
    ifUserExists: function (userId, callback) {
        databaseController.findUser(userId, function (err, result) {
            callback(!result || result.length > 0);
        });
    },

    register: function (info, callback) {
        connection.query('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [info.userId, info.username, info.password, info.sex, info.description, info.email, 0, info.payword, info.avatar], 
            callback);
    }
};

module.exports = databaseController;
