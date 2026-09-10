import { NextResponse } from "next/server";
import { withAuth } from "@/lib/with-auth";
import { createOption, deleteUserOption } from "@/service/options";

export const POST = withAuth(async (request, context) => {
  const data = await request.json();

  const userId = context.user.id;
  const res = await createOption({
    ...data,
    userId,
  });

  if (!res.ok) {
    return NextResponse.json({ error: res.error }, {
      status: res.error.status,
    });
  }

  return NextResponse.json({ result: res.data }, {
    status: 201,
  });
});

export const DELETE = withAuth(async (request, context) => {
  const userId = context.user.id;
  const { optionId } = await request.json();
  const res = await deleteUserOption(optionId, userId);

  if (!res.ok) {
    return NextResponse.json({ error: res.error }, {
      status: res.error.status,
    });
  }

  return NextResponse.json({ result: res.data });
});
