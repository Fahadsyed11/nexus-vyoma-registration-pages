import { RegisterUserFormInput, registerUserFormDto } from "@/dto/(register)/register-user.dto";
import { validateDto } from "@/dto/validate.dto-helper";

// use DTO types here
export function destructureSumbitBody(body: FormData | Record<string, unknown>) {
    const getVal = (key: string): string => {
        if (typeof FormData !== "undefined" && body instanceof FormData) {
            const val = body.get(key);
            return typeof val === "string" ? val : "";
        }
        const val = (body as Record<string, unknown>)[key];
        return typeof val === "string" ? val : val != null ? String(val) : "";
    };

    const rawData: RegisterUserFormInput = {
        email: getVal("email"),
        full_name: getVal("full_name"),
        phone_number: getVal("phone_number"),
        city: getVal("city"),
        state: getVal("state"),
        institution: getVal("institution"),
        year_of_study: getVal("year_of_study"),
        degree: getVal("degree"),
    };

    const { data, issues, success } = validateDto(registerUserFormDto, rawData);

    return {
        data,
        issues,
        success,
    };
}
