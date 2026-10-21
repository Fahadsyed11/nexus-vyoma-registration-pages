import * as v from "valibot";

export const registerUserFormDto = v.object({
    // personal details
    full_name: v.pipe(v.string(), v.trim(), v.minLength(3), v.maxLength(50)),
    phone_number: v.pipe(
        v.string(),
        v.trim(),
        v.regex(/^\d{10}$/, "Phone number must be exactly 10 digits with no spaces")
    ),
    email: v.pipe(v.string(), v.email(), v.trim()),

    // professional details
    institution: v.pipe(v.string(), v.trim(), v.minLength(2), v.maxLength(100)),
    year_of_study: v.pipe(v.string(), v.picklist(["1", "2", "3", "4", "5", "6"])),
    degree: v.pipe(v.string(), v.trim(), v.minLength(2), v.maxLength(50)),

    // address details
    state: v.pipe(v.string(), v.trim(), v.minLength(2), v.maxLength(50)),
    city: v.pipe(v.string(), v.trim(), v.minLength(2), v.maxLength(50)),
});


export type RegisterUserFormOutput = v.InferOutput<typeof registerUserFormDto>;
export type RegisterUserFormInput = v.InferInput<typeof registerUserFormDto>;