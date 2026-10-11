import * as v from "valibot";

export const checkUserEmailDto = v.object({
    email: v.pipe(v.string(), v.email(), v.trim()),
});

export type CheckUserEmailOutput = v.InferOutput<typeof checkUserEmailDto>;
export type CheckUserEmailInput = v.InferInput<typeof checkUserEmailDto>;