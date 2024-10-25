const jwt = require("jsonwebtoken");

const Blacklist = require('../models/blacklist')

const User = require("../models/user")
const verifyToken = async (req, res, next) => {


    const token = req.headers['authorization'];
    if (!token) return res.status(403).send({ message: 'No token provided.' });

    const bearerToken = token.split(' ')[1];

    const blacklistedToken = await Blacklist.findOne({ where: { token: bearerToken } });
    if (blacklistedToken) {
        return res.status(401).send({ message: 'Token has been invalidated.' });
    }


    jwt.verify(bearerToken, 'aman@12', async (err, decoded) => {
        if (err) return res.status(401).send({ message: 'Unauthorized!' });

        try {
            console.log(decoded.id , "hiii")

            const user = await User.findByPk(decoded.id, { attributes: ['id', 'role'] });
            console.log(user)
            // if (!user) return res.status(404).send({ message: 'User not found.' });
          

            req.user = {
                id: user.id,
                role: user.role,
            };

            next();
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching user data', error: error.message });
        }
    });

    // const token = req.headers['authorization'];
    // if (!token) return res.status(403).send({ message: 'No token provided.' });

    // const bearerToken = token.split(' ')[1];

    // const blacklistedToken = await Blacklist.findOne({ where: { token: bearerToken } });
    // if (blacklistedToken) {
    //     return res.status(401).send({ message: 'Token has been invalidated.' });
    // }

    // jwt.verify(bearerToken, "aman@12", (err, decoded) => {
    //     if (err) return res.status(401).send({ message: 'Unauthorized!' });
    //     console.log(decoded.role)

    //     req.userId = decoded.id;
    //     req.role = decoded.role

    //     console.log(req.role)

    //     console.log("Decoded user:", req.userId);

    //     next();
    // });
    // const token = req.headers['authorization'];
    // console.log(req.headers)

    // if (!token) return res.status(403).send({ message: 'No token provided.' });

    // const bearerToken = token.split(' ')[1];

    // const blacklistedToken = Blacklist.findOne({ where: { token: bearerToken } });
    // if (blacklistedToken) {
    //     return res.status(401).send({ message: 'Token has been invalidated.' });
    // }


    // jwt.verify(bearerToken, "aman@12", (err, decoded) => {
    //     if (err) return res.status(401).send({ message: 'Unauthorized!' });

    //     req.userId = decoded.id;
    //     next();

    // });
};


module.exports = verifyToken;
