/**
 * Created by mike on 7/17/16.
 */
"use strict";

var config = {
    database: {
        host: process.env.MYSQL_HOST || 'localhost',
        port: process.env.MYSQL_PORT || '3306',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '12345687',
        scheme: process.env.MYSQL_SCHEME || 'xcccf_pay',
    },
    
    interface: {
        login: '/login',
        logout: '/logout',
        topup: '/topup',
        withdraw: '/withdraw',
        register: '/register',
        getOtherInfo: '/getUserInfo',
        getMyInfo: '/getSelfInfo',
        updateMyInfo: '/updateUserInfo',
        transfer: '/transfer'
    }
}

module.exports = config;
