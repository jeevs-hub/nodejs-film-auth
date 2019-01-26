const Router = require('express-promise-router');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const router = new Router();
const db = require("../utils/db.js");
var VerifyToken = require('./VerifyToken');

module.exports = router;

router.post("/login", async (req, res) => {
    console.log("the req body ", JSON.stringify(req.body));
    const client = await db.client();

    try {
        const { email, password } = req.body;
        const { rows } = await db.query("select id, password from users where email = $1", [email]);

        if (!rows || rows.length === 0) res.status(400).send("Invalid Username or Password");
        const validPassword = await bcrypt.compare(password, rows[0].password);
        if (!validPassword) res.status(400).send("Invalid Username or Password");

        var token = jwt.sign({ id: rows[0].id }, "secret", { expiresIn: 86400 });

        res.send(token);
    } catch (e) {
        console.log("error logging in ", (e))
        res.status(500).send("Internal Server Error");
    } finally {
        client.release();
    }
});

router.post("/register", async (req, res) => {
    console.log("the req body ", JSON.stringify(req.body));
    const client = await db.client();

    try {
        const { email, password, passwordConfirmation, dateOfBirth, firstName, lastName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const { rows } = await db.query(`insert into users(id, first_name, last_name, date_of_birth, password, email)
                                        values ($1, $2, $3, $4, $5, $6)` ,
            [uuidv4(), firstName, lastName, dateOfBirth, hashedPassword, email]);

        var token = jwt.sign({ id: rows[0].id }, "secret", { expiresIn: 86400 });

        res.send(token);
    } catch (e) {
        console.log("error logging in ", (e))
        res.status(500).send("Internal Server Error");
    } finally {
        client.release();
    }
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