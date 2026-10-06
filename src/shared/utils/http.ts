import { NextResponse } from "next/server";
import type { ZodError } from "zod";

/** 400 response carrying a zod validation error, flattened per field. */
export function badRequest(error: ZodError) {
  return NextResponse.json({ error: error.flatten() }, { status: 400 });
}
