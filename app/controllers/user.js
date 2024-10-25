const express = require("express");
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/authMiddleware")
const Blacklist = require("../models/blacklist")

const checkPasswordValidity = (value) => {
    if (value.includes(" ")) {
        return "Password must not contain Whitespaces.";
    }

    let hasUppercase = false;
    let hasLowercase = false;
    let hasNumber = false;
    let hasSymbol = false;

    // Iterate through each character of the password
    for (let i = 0; i < value.length; i++) {
        const char = value[i];

        // Check for uppercase letters
        if (char >= "A" && char <= "Z") {
            hasUppercase = true;
        }

        // Check for lowercase letters
        if (char >= "a" && char <= "z") {
            hasLowercase = true;
        }

        // Check for numbers
        if (char >= "0" && char <= "9") {
            hasNumber = true;
        }

        // Check for special symbols
        const symbols = "~`!@#$%^&*()--+={}[\\]|:;\"'<>,.?/_₹";
        if (symbols.includes(char)) {
            hasSymbol = true;
        }
    }

    if (!hasUppercase) {
        return "Password must have at least one Uppercase Character.";
    }

    if (!hasLowercase) {
        return "Password must have at least one Lowercase Character.";
    }

    if (!hasNumber) {
        return "Password must contain at least one Digit.";
    }

    if (!hasSymbol) {
        return "Password must contain at least one Special Symbol.";
    }

    if (value.length < 10 || value.length > 16) {
        return "Password must be 10-16 Characters Long.";
    }

    return null;

};
const mailSender = require("../utils/mailSender");

module.exports = function (app) {

    const apiRoutes = express.Router()


    apiRoutes.post("/register", async (req, res) => {
        const { username, email, password, role } = req.body;

        if (!username || !username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const passwordValidationMessage = checkPasswordValidity(password);
        if (passwordValidationMessage) {
            return res.status(400).json({ message: passwordValidationMessage });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({
            username,
            email,
            password: bcrypt.hashSync(req.body.password, 8),
            role
        });

        await mailSender(
            email,
            "Registration Successful", 
            "Your registration has been successfully completed."
        );
        console.log(user)
        await user.save();
        res.status(201).send(user);
    });




    apiRoutes.post('/login', async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({
                where: { email }
            });

            if (!user) {
                return res.status(400).json({ error: 'Invalid email or password.' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ error: 'Invalid email or password.' });
            }

            console.log(isPasswordValid)

            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                'aman@12',
                { expiresIn: '1h' }
            );

            res.json({ message: 'Login successful', token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred during login.' });
        }
    });



    apiRoutes.get("/token", verifyToken, async (req, res) => {
        try {
            console.log("Request Body:", req.body);

            const user = await User.findByPk(req.user.id);
            console.log("Request User:", req.user);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json({
                message: "You have accessed the protected route!",
                data: user,
            });
        } catch (error) {
            console.error("Error fetching user:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    });


    // apiRoutes.post('/logout', verifyToken, (req, res) => {
    //     res.status(200).json({ message: 'User logged out successfully.' });

    // });


    apiRoutes.post('/logout', verifyToken, async (req, res) => {
        const token = req.headers['authorization'].split(' ')[1];

        const decodedToken = jwt.decode(token);
        await Blacklist.create({
            token: token,
            expiry: new Date(decodedToken.exp * 1000),
        });

        res.status(200).json({ message: 'User logged out successfully, token invalidated.' });
    });









    apiRoutes.get("/app", (req, res) => {
        res.send(req.body)

    })

    app.use("/", apiRoutes)
}