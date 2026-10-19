import { Cashfree, CFEnvironment } from "cashfree-pg";

const isProduction = process.env.NODE_ENV === "production";

const sandbox_payment_api_secret_key = process.env.SANDBOX_PAYMENT_KEY_SECRET;
const sandbox_payment_api_id = process.env.SANDBOX_PAYMENT_KEY_ID;

const production_payment_api_secret_key = process.env.PAYMENT_KEY_SECRET;
const production_payment_api_id = process.env.PAYMENT_KEY_ID;

let cashfree: Cashfree;

if (isProduction) {
    if (!production_payment_api_secret_key || !production_payment_api_id) {
        throw new Error("Production Cashfree API keys are not set in environment variables.");
    }

    cashfree = new Cashfree(
        CFEnvironment.PRODUCTION,
        production_payment_api_id, // Replace with your Cashfree App ID
        production_payment_api_secret_key // Replace with your Cashfree Secret Key
    );
} else {
    cashfree = new Cashfree(
        CFEnvironment.SANDBOX,
        sandbox_payment_api_id, // Replace with your Cashfree App ID
        sandbox_payment_api_secret_key // Replace with your Cashfree Secret Key
    );
}

export default cashfree;
