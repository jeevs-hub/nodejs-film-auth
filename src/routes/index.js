"use strict";

const auth = require('../auth/auth-service')

module.exports = (app) => {
    app.use('/auth', auth)
}