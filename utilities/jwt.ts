import jwt from "jsonwebtoken";

// sign a JWT token with the given payload and secret

const secret = process.env.JWT_SECRET;

export function signJWT(payload: object, options?: jwt.SignOptions): string {
    return jwt.sign(payload, secret as string, options || {
        expiresIn: "2h", // default expiration time of 1 hour
    });
}

export function verifyJWT(token: string): object | null {
    try {
        return jwt.verify(token, secret as string) as object;
    } catch (error) {
        return null;
    }
}
