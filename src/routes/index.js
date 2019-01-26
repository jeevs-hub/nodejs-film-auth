"use strict";

const auth = require('../auth/authService')

module.exports = (app) => {
    app.use('/auth', auth)
}