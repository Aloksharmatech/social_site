const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: 'User not authenticated',
                success: false
            });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = { id: decode.userId };
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            message: 'Invalid token',
            success: false
        });
    }
};

module.exports = isAuthenticated; 
