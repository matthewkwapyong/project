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
        req.tokenData = decoded
        next();
    });
}
module.exports = validateToken;