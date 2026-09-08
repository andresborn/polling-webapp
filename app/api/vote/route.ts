import { NextRequest, NextResponse } from "next/server";
import { createVote } from "@/service/vote";
import { voteInsertSchema } from "@/db/schema/vote";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import z from "zod";

export const POST = async (request: NextRequest) => {
  const res = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = res ? res.user.id : null;

  const data = await request.json();
  const parsed = voteInsertSchema.safeParse({ ...data, userId });

  if (parsed.success && parsed.data) {
    const { success, error, result } = await createVote(parsed.data);

    if (success) {
      return NextResponse.json({ result }, { status: 201 });
    } else {
      return NextResponse.json({
        message: "Unable to create vote.",
        error: error instanceof Error
          ? { name: error.name, message: error.message }
          : {},
      }, {
        status: 400,
      });
    }
  } else {
    return NextResponse.json({
      message: "Unable to create vote.",
      error: z.treeifyError(parsed.error),
    }, { status: 400 });
  }
};
