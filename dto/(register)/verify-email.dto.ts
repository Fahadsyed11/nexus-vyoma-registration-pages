import * as v from "valibot";

export const verifyUserEmailDto = v.object({
    email: v.pipe(v.string(), v.email(), v.trim()),
    otp: v.pipe(v.string(), v.length(6), v.regex(/^[0-9]+$/))
});

export type VerifyUserEmailOutput = v.InferOutput<typeof verifyUserEmailDto>;
export type VerifyUserEmailInput = v.InferInput<typeof verifyUserEmailDto>;