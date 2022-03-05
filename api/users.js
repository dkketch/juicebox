const express = require('express');
const usersRouter = express.Router();

const { getAllUsers, getUserbyUsername, getUserById } = require('../db');

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

usersRouter.use((req, res, next) => {
    console.log("A request is being made to /users");

    // res.send({ message: 'hello from /users!' });
    next();
});

usersRouter.get('/', async(req, res) => {
    const users = await getAllUsers();

    res.send({
        users
    });
});

usersRouter.post('/login', async(req, res, next) => {
    // console.log(req.body);
    // res.end();

    const { username, password } = req.body;

    //request must have both
    if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        });
    }

    try {
        const user = await getUserbyUsername(username);

        if (user && user.password == password) {
            // create token & return to user
            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
            res.send({ message: "you're logged in!", token: token });
        } else {
            next({
                name: 'IncorrectCredentialsError',
                message: 'Username or password is incorrect'
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

module.exports = usersRouter;