import jwt from "jsonwebtoken";

// sign a JWT token with the given payload and secret

function getSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret || secret.length < 32) {
        throw new Error("JWT_SECRET must be configured with at least 32 characters");
    }

    return secret;
}

export function signJWT(payload: object, options?: jwt.SignOptions): string {
    return jwt.sign(payload, getSecret(), options || {
        expiresIn: "2h", // default expiration time of 2 hour
    });
}

export function verifyJWT(token: string): object | null {
    try {
        return jwt.verify(token, getSecret()) as object;
    } catch {
        return null;
    }
}
