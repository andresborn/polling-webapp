import { NextRequest, NextResponse } from "next/server";
import { createVote } from "@/service/vote";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const POST = async (request: NextRequest) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session ? session.user.id : null;

  const data = await request.json();

  const res = await createVote({ ...data, userId });

  if (!res.ok) {
    return NextResponse.json({
      error: res.error,
    }, { status: res.error.status });
  }

  return NextResponse.json({ result: res.data });
};
