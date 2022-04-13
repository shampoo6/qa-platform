module.exports = {
    success(data) {
        return {success: true, msg: 'ok', data};
    },
    fail(msg, data) {
        return {success: false, msg, data};
    }
};