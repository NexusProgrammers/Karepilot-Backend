import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (userId: string, rememberMe: boolean = false): string => {
  const expiresIn = rememberMe ? '30d' : '7d';
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};

export const extractUserIdFromToken = (token: string): string | null => {
  try {
    const decoded = verifyToken(token);
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    jwt.verify(token, JWT_SECRET);
    return false;
  } catch (error: any) {
    return error.name === 'TokenExpiredError';
  }
};

export const refreshToken = (userId: string, rememberMe: boolean = false): string => {
  return generateToken(userId, rememberMe);
};

export const validate = (schema: any, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: any, res: any, next: any): void => {
    const data = req[source];
    const { error, value } = schema.validate(data, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const errors = error.details.map((detail: any) => detail.message);
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