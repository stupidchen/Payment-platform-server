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
                if (result[0] && result[0].password === password) {
                    callback(err);
                }
                else {
                    callback(errorUtil.createError(1));
                }
        });
    },
    
    verifyPay: function (userId, payword, callback) {
         connection.query('SELECT * FROM users WHERE userId = ? AND payword = ?',
            [userId, payword],
            function (err, result) {
                if (result[0] && result[0].payword === payword) {
                    callback(err);
                }
                else {
                    callback(errorUtil.createError(7));
                }
        });  
    },
    
    verifyCash: function (userId, amount, callback) {
        this.findUser(userId, function (err) {
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
        var value = '';
        if (info.username) {
            value += ' t.username = ' + info.username + '';
        }
        if (info.password) {
            value += ' t.password = ' + info.password + '';
        }
        if (info.sex) {
            value += ' t.sex = ' + info.sex + '';
        } 
        if (info.description) {
            value += ' t.description = ' + info.description + '';
        }
        if (info.email) {
            value += ' t.email = ' + info.email + '';
        }
        if (info.payword) {
            value += ' t.payword = ' + info.payword + '';
        }
        connection.query('UPDATE users t SET ' + value + ' WHERE userId = ?', userId, callback);
    },
    
    transfer: function (fromUserId, toUserId, payword, amount, callback) {
        this.verifyPay(fromUserId, payword, function(err) {
            if (err) {
                callback(err);
                return;
            }
            this.verifyCash(fromUserId, amount, function (err) {
                if (err) {
                    callback(err);
                    return;
                }
                connection.query('UPDATE users t SET t.money = t.money - ? WHERE fromUserId = ?', [amount, fromUserId], function (err, result) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    connection.query('UPDATE users t SET t.money = t.money + ? WHERE toUserId = ?', [amount, toUserId], function (err, result) {
                        if (err) {
                            connection.query('UPDATE users t SET t.money = t.money + ? WHERE fromUserId = ?', [amount, fromUserId], function (err) {
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
        this.verifyPay(userId, payword, function (err) {
            if (err) {
                callback(err);
                return; 
            }
            connection.query('UPDATE users t SET t.money = t.money + ? WHERE userId = ?', [amount, userId], callback);
        });
    },

    withdraw: function (userId, payword, amount, callback) {
        this.verifyPay(userId, payword, function (err) {
            if (err) {
                callback(err);
                return;
            }
            this.verifyCash(userId, amount, function (err) {
                if (err) {
                    callback(err);
                    return;
                }
                connection.query('UPDATE users t SET t.money = t.money - ? WHERE userId = ?', [amount, userId], callback);
            });
        });
    },
    
    ifUserExists: function (userId, callback) {
        this.findUser(userId, function (err) {
            callback(!(err == null));
        });
    },

    register: function (info, callback) {
        connection.query('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [info.userId, info.username, info.password, info.sex, info.description, info.email, 0, info.payword], 
            callback);
    }
};

module.exports = databaseController;
