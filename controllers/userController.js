const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token')
const crypto = require("crypto");
const { sendMail } = require('../services/mailService')


async function register(req, res) {
    const { email, password, name } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res
                .status(400)
                .send({ errors: [{ msg: 'user already exists' }] });
        }

        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
        const createdUser = await new User(req.body).save();
        let token = await new Token({
            userId: createdUser.id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const message = `${process.env.BASE_URL}/user/verify/${createdUser.id}/${token.token}`;
        await sendMail("bosta@bosta.com", [createdUser.email], "Verify Email", message);

        res.send("An Email sent to your account please verify");

    } catch (error) {
        res.status(500).send('server error');
    }
}

async function login(req, res) {

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .send({ errors: [{ msg: 'invalid credentials' }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .send({ errors: [{ msg: 'Invalid credentials' }] });
        }

        const payload = {
            user: user,
        };
        jwt.sign(
            payload,
            process.env.jwtSecret,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json(token);
            }
        );
    } catch (error) {
        console.log(error)
        res.status(500).send('server error');
    }
}

async function verify(req, res) {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send("Invalid link");

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link");

        await User.updateOne({ _id: user._id, verified: true });
        await Token.findByIdAndRemove(token._id);

        res.send("email verified sucessfully");
    } catch (error) {
        res.status(400).send("An error occured");
    }
}


module.exports = { register, login, verify };