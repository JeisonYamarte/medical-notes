import { z } from "zod";
import { NextResponse } from "next/server";

export async function validateRequest<T>(req: Request, schema: z.ZodSchema): Promise<{ data?: T; error?: NextResponse }> {
    try {
        const body = await req.json();
        const result = schema.safeParse(body);

        if (!result.success) {
        return { error: NextResponse.json({ error: result.error }, { status: 400 }) };
        }
        return { data: result.data as T };
    } catch {
        return { error: NextResponse.json({ error: "error process request" }, { status: 400 }) };
    }
};