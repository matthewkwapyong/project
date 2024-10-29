const jwt = require('jsonwebtoken');

function validateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]
    if (token === null) return res.sendStatus(401)
    jwt.verify(token, process.env.secretKey, function (err, decoded) {
        if (err) {
            res.status(401).json({ auth: false });
            return;
        }
        // console.log(decoded)
        req.tokenData = decoded
        next();
    });
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.secretKey, { expiresIn: '1d' })
}

module.exports = {validateToken,generateAccessToken};