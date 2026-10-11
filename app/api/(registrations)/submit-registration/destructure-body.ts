import { RegisterUserFormInput, registerUserFormDto } from "@/dto/(register)/register-user.dto";
import { validateDto } from "@/dto/validate.dto-helper";

// use DTO types here
export function destructureSumbitBody(body: FormData) {
    const rawData: RegisterUserFormInput = {
        email: body.get("email") as string,
        full_name: body.get("full_name") as string,
        phone_number: body.get("phone_number") as string,
        city: body.get("city") as string,
        state: body.get("state") as string,
        institution: body.get("institution") as string,
        year_of_study: body.get("year_of_study") as string,
        degree: body.get("degree") as string,
    }

    const {data, issues, success} = validateDto(registerUserFormDto, rawData);

    return {
        data,
        issues,
        success,
    }
}
