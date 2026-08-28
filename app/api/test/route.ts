import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { withAuth } from "@/lib/with-session";

export const GET = withAuth(async (request: NextRequest, context) => {
  return NextResponse.json({ hello: "world" });
});
