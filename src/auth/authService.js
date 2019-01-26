const Router = require('express-promise-router');
const router = new Router();
const db = require("../utils/db.js");
const VerifyToken = require('./VerifyToken');
const userController = require('./userController');

module.exports = router;

router.post("/login", async (req, res) => {
    const { body } = req;
    console.log("the req body for login ", JSON.stringify(body));
    userController.login(body)
        .then((token) => res.send({ token }))
        .catch((err) => res.status(err.status).send({ error: err.message }))
});

router.post("/register", async (req, res) => {
    const { body } = req;
    console.log("the req body for register ", JSON.stringify(body));
    userController.register(body)
        .then((token) => res.send({ token }))
        .catch((err) => res.status(err.status).send({ error: err.message }))
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