import * as v from "valibot";

export const contactDto = v.object({
    full_name: v.pipe(v.string(), v.trim(), v.minLength(3), v.maxLength(50)),
    phone_number: v.pipe(v.string(), v.transform(input => input.toString()), v.string(), v.minLength(10), v.maxLength(10)),
    email: v.pipe(v.string(), v.email(), v.trim()),
    message: v.pipe(v.string(), v.trim())
});

export type ContactOutput = v.InferOutput<typeof contactDto>;
export type ContactInput = v.InferInput<typeof contactDto>;