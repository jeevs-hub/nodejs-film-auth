const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');

const constants = require('../utils/constants.js');
const db = require("../utils/db.js");

module.exports.login = async (body) => {
    const { username, password } = body;
    return getUser(username).then(async (user) => {
        console.log("got user ", user)
        if (!user) throw { status: 400, message: "Invalid Username or Password" };
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw { status: 400, message: "Invalid Username or Password" };
        return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 });
    });
}

module.exports.register = async (body) => {
    const client = await db.client();
    const { PASSWORD_VALIDATION, EMAIL_VALIDATION } = constants;

    try {
        const { email, password, passwordConfirmation, dateOfBirth, firstName, lastName } = body;
        const existingUser = await getUser(email);

        if(existingUser) throw { status: 400, message: "User is already registered" };
        if(password !== passwordConfirmation) throw { status: 400, message: "Passwords do not match" };
        if(!PASSWORD_VALIDATION.test(password)) throw { status: 400, message: "Password does not meet validation" };
        if(!EMAIL_VALIDATION.test(email))  throw { status: 400, message: "Email is not valid" };
        const id = uuidv4();
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.HASH_SALT));
        await db.query(`insert into users(id, first_name, last_name, date_of_birth, password, email) values ($1, $2, $3, $4, $5, $6)` ,
            [id, firstName, lastName, new Date(dateOfBirth), hashedPassword, email]);

        return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: 86400 });
    } catch (e) {
        console.log("error registering in ", (e))
        throw { status: e.status ? e.status : 500, message: e.message ? e.message : `Something went wrong at our end.` }
    } finally {
        client.release();
    }
}

//Incase we want to swtich back to promise
// module.exports.validateToken = (token, res) => {
//     return new Promise((resolve, reject) => {
//         jwt.verify(token, "secret", function(err, decoded) {
//             if (err) return reject({ message: 'Failed to authenticate token.' });
//             resolve(decoded.id);
//         });
//     });       
// }

//used a callback as jwt.decode uses callback so follow that pattern
module.exports.validateToken = (token, callback) => {
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) return callback({ status: 403, message: 'Failed to authenticate token.' });
        callback(null, decoded.id);
    });
}

async function getUser(email) {
    const client = await db.client();
    console.log(`getting user ${email}`)
    try {
        const { rows } = await db.query("select id, password from users where email = $1", [email]);
        return rows[0];
    } catch (e) {
        console.log("error logging in ", e)
        throw { status: 500, message: `Something went wrong at our end.` }
    } finally {
        client.release();
    }
}