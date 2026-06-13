import { z } from "zod";
import { NextResponse } from "next/server";

export async function validateRequest<T>(req: Request, schema: z.ZodType<T>): Promise<{ data?: T; error?: NextResponse }> {
    try {
        const body = await req.json();
        const result = schema.safeParse(body);

        if (!result.success) {
            return {
                error: NextResponse.json(
                    {
                        success: false,
                        error: "Invalid request payload",
                        details: result.error.flatten(),
                    },
                    { status: 400 }
                ),
            };
        }

        return { data: result.data as T };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error processing request";
        return {
            error: NextResponse.json(
                {
                    success: false,
                    error: message,
                },
                { status: 400 }
            ),
        };
    }
};