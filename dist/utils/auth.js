import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
export const extractUserIdFromToken = (token) => {
    try {
        const decoded = verifyToken(token);
        return decoded.userId;
    }
    catch (error) {
        return null;
    }
};
export const isTokenExpired = (token) => {
    try {
        jwt.verify(token, JWT_SECRET);
        return false;
    }
    catch (error) {
        return error.name === 'TokenExpiredError';
    }
};
export const refreshToken = (userId) => {
    return generateToken(userId);
};
export const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const data = req[source];
        const { error, value } = schema.validate(data, {
            abortEarly: false,
            stripUnknown: true
        });
        if (error) {
            const errors = error.details.map((detail) => detail.message);
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
            return;
        }
        req[source] = value;
        next();
    };
};
//# sourceMappingURL=auth.js.map