import { randomInt } from "crypto";

export function generateOtp(length: number = 6): string {
    let result = "";
    const characters = "0123456789";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(randomInt(0, characters.length));
    }
    return result;
}

