/**
 * Created by mike on 7/8/16.
 */

var errorUtil = {
    getErrorCode: function (error) {
        if (error && error.statusCode) {
            return error.statusCode;
        }
        else {
            return 0;
        }
    },
    
    createError: function (errorCode) {
        switch (errorCode) {
            case 10: return {
                statusCode: errorCode,
                host: 'system',
                message: 'Serious error. Please contact to the system admin'
            };
            case 9: return {
                statusCode: errorCode,
                host: 'system',
                message: 'Serious error. The operation has been cancelled.'
            };
            case 1: return {
                statusCode: errorCode,
                host: 'system',
                message: 'ID or password is incorrect!'
            };
            case 2: return {
                statusCode: errorCode,
                host: 'database',
                message: 'database error'
            };
            case 3: return {
                statusCode: errorCode,
                host: 'system',
                message: 'system error'
            };
            case 4: return {
                statusCode: errorCode,
                host: 'client',
                message: 'This user has been login!'
            };
            case 5: return {
                statusCode: errorCode,
                host: 'client',
                message: 'Token is invalid!'
            };
            case 6: return {
                statusCode: errorCode,
                host: 'client',
                message: 'This ID has been registered!'
            };
            case 7: return {
                statusCode: errorCode,
                host: 'client',
                message: 'The payword is incorrect!'
            };
            case 8: return {
                statusCode: errorCode,
                host: 'client',
                message: 'Insufficient balance!'
            };
        }
        return {
            statusCode: errorCode,
            host: 'system',
            message: 'Unknown error'
        };
    }
}

module.exports = errorUtil;
