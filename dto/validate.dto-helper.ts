import * as v from "valibot";

export function validateDto<TSchema extends v.GenericSchema>(schema: TSchema, data: v.InferInput<TSchema>): { success: boolean; data: v.InferOutput<TSchema> | null; issues: v.InferIssue<TSchema>[] | null } {
    const { issues, output, success } = v.safeParse(schema, data);

    if (!success) {
        return {
            success: false,
            data: null,
            issues: issues
        };
    }

    return {
        success: true,
        data: output,
        issues: null
    };
}