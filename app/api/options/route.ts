import { NextResponse } from "next/server";
import { withAuth } from "@/lib/with-session";
import { createOption, deleteUserOption } from "@/service/options";

export const POST = withAuth(async (request, context) => {
  const data = await request.json();

  const userId = context.user.id;
  const { result, success, error } = await createOption({
    ...data,
    userId,
  });

  if (!success) {
    return NextResponse.json({
      message: "Can't create option.",
      error: JSON.stringify(error),
    }, { status: 400 });
  }

  return NextResponse.json({ message: "Option created.", result }, {
    status: 201,
  });
});

export const DELETE = withAuth(async (request, context) => {
  const userId = context.user.id;
  const { optionId } = await request.json();
  const { success, error, result } = await deleteUserOption(optionId, userId);

  if (!success) {
    return NextResponse.json({
      message: "Couldn't delete the option.",
      error: JSON.stringify(error),
    }, { status: 400 });
  }

  return NextResponse.json({ result });
});
