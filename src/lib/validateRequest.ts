import { z } from "zod";
import { NextResponse } from "next/server";

export const validateRequest = async (req: Request, schema: z.ZodSchema) => {
    try {
        const body = await req.json();
        const result = schema.safeParse(body);

        if (!result.success) {
        return { error: NextResponse.json({ error: result.error }, { status: 400 }) };
        }

        return { data: result.data };
    } catch {
        return { error: NextResponse.json({ error: "error process request" }, { status: 400 }) };
    }
};