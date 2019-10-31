const Router = require('express-promise-router');
const router = new Router();
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

//used by external services such as film api
//TODO move to seperate service along with logic for checking if the 
//token is valid
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
});

//test endpoint
router.get("/ping", async (req, res) => {
    res.send("pong");
});