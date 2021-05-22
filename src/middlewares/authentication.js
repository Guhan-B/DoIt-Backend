import jwt from 'jsonwebtoken';

const authenticationMiddleware = async (req, res, next) => {
    const token = req.get('Authorization');

    if (!token || token === '') {
        req.userId = null;
        req.isAuthorised = false;
        req.errorCode = 'TOKEN_REQUIRED'
        return next();
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decodedToken) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                req.userId = null;
                req.isAuthorised = false;
                req.errorCode = 'TOKEN_EXPIRED';
                return next();
            } else {
                req.userId = null;
                req.isAuthorised = false;
                req.errorCode = 'INVALID_TOKEN';
                return next();
            }
        } else {
            if (decodedToken.tokentype === 'ACCESS') {
                req.userId = decodedToken.id;
                req.isAuthorised = true;
                req.errorCode = null;
                console.log("[middel]",decodedToken.id);
                return next();
            } else {
                req.userId = null;
                req.isAuthorised = false;
                req.errorCode = 'INVALID_TOKEN';
                return next();
            }
        }
    });
}

export default authenticationMiddleware;