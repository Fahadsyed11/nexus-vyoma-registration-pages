
// use DTO types here
export function destructureSumbitBody(body: any) {
    const email = body.get("email") as string;
    const full_name = body.get("full_name") as string;
    const phone_number = body.get("phone_number") as string;
    const city = body.get("city") as string;
    const state = body.get("state") as string;
    const institution = body.get("institution") as string;
    const year_of_study = body.get("year_of_study") as string;
    const degree = body.get("degree") as string;

    return {
        email,
        full_name,
        phone_number,
        city,
        state,
        institution,
        year_of_study,
        degree
    }
}