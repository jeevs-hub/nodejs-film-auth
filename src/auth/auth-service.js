const Router = require('express-promise-router');
const router = new Router();
const db = require("../utils/db.js");
const VerifyToken = require('./verify-token');
const verifyApiKey = require('./very-api-key');
const userController = require('./user-controller');

module.exports = router;

router.post("/login", async (req, res) => {
    const { body } = req;
    console.log("the req body for login ", JSON.stringify(body));
    userController.login(body)
        .then((token) => res.send({ token }))
        .catch((err) => res.status(err.status).send({ error: { status: err.status, message: err.message } }))
});

router.post("/register", async (req, res) => {
    const { body } = req;
    console.log("the req body for register ", JSON.stringify(body));
    userController.register(body)
        .then((token) => res.send({ token }))
        .catch((err) => res.status(err.status).send({ error: { status: err.status, message: err.message } }))
});

router.post("/validateAuth", verifyApiKey, async (req, res) => {
    const { token } = req.body;
    console.log("the req body validate auth ", token);
    //used a callback as jwt.decode uses callback so follow that pattern
    userController.validateToken(token, (err, id) => {
        if (err) {
            return res.status(err.status).send({ error: { status: err.status, message: err.message } });
        } else {
            return res.send({ id });
        }
    });
    //left in case we want to switch back to promises
    // userController.validateToken(token)
    //     .then((id) => res.send({ id }))
    //     .catch((err) => res.status(err.status).send({ error: { status: err.status, message: err.message } }))
});

router.get("/all", async (req, res) => {
    const client = await db.client();
    try {
        const { rows } = await db.query(`select * from users`);
        res.send(rows);
    } catch (e) {
        console.log("error logging in ", (e))
        res.status(500).send("Internal Server Error");
    } finally {
        client.release();
    }
});

router.get("/ping", VerifyToken, async (req, res) => {
    res.send("pong");
});