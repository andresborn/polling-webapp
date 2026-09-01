import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/with-auth";

export const GET = withAuth(async (request: NextRequest, context) => {
  return NextResponse.json({ hello: "world" });
});
