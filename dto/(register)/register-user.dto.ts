import * as v from "valibot";

export const registerUserFormDto = v.object({
    // personal details
    full_name: v.pipe(v.string(), v.trim(), v.minLength(3), v.maxLength(50)),
    phone_number: v.pipe(v.string(), v.transform(input => input.toString()), v.string(), v.minLength(10), v.maxLength(10)),
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