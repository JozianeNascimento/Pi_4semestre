const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
    const token = req.cookies["access-token"];

    if (!token) {
        res.redirect("/auth/login");
    }

    try {
        const secret = process.env.SECRET;

        jwt.verify(token, secret);

        next();

    } catch (error) {
        res.redirect("/auth/login");
    }

}

module.exports = checkToken