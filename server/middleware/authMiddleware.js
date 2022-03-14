const expressAsyncHandler = require("express-async-handler");

exports.protect = expressAsyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Não autorizado, token falhou');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Não autorizado, sem token');
    }
});

exports.admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Não autorizado, você não é  um admin');
    }
};




