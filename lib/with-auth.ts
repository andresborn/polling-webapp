import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { User } from "better-auth"; // Use zod types?

type AuthenticatedHandler = (
  request: NextRequest,
  context: { params: Promise<Record<string, string>>; user: User },
) => Promise<Response>;

export const withAuth = (handler: AuthenticatedHandler) => {
  return async (
    request: NextRequest,
    context: { params: Promise<Record<string, string>>; user: User },
  ) => {
    const res = await auth.api.getSession({
      headers: await headers(),
    });

    if (!res?.session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    return handler(request, { ...context, user: res?.user });
  };
};
