verifyApiKey = (req, res, next) => {
    console.log("the headers", req.headers);
    var key = req.headers['x-api-key'];
    if (!key) {
        return res.status(400).send({ message: 'Authorisation not provided.' });
    }

    
    if (key === process.env.API_KEY) {
        next();
    }
    else {
        return res.status(403).send({ message: 'Invalid Api Key.' });
    }
}

module.exports = verifyApiKey;
