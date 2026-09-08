import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/with-auth";
import {
  createPoll,
  deleteUserPoll,
  getUserPolls,
  getUserPollWithOptions,
  updatePoll,
} from "@/service/poll";

export const GET = withAuth(async (request, context) => {
  const userId = context.user.id;
  const { searchParams } = new URL(request.url);
  const pollId = searchParams.get("id");
  if (pollId) {
    const result = await getUserPollWithOptions(userId, pollId);
    return NextResponse.json({ result });
  }

  const { success, error, result } = await getUserPolls({ userId });

  if (!success) {
    return NextResponse.json({
      message: "Couldn't query user polls.",
      error: JSON.stringify(error),
    }, { status: 400 });
  }

  return NextResponse.json({ result });
});

export const POST = withAuth(async (request, context) => {
  const data = await request.json();

  const userId = context.user.id;
  const { result, success, error } = await createPoll({ ...data, userId });

  if (!success) {
    return NextResponse.json({
      message: "Can't create poll.",
      error: JSON.stringify(error),
    }, { status: 400 });
  }

  return NextResponse.json({ message: "Poll created.", result }, {
    status: 201,
  });
});

export const PUT = withAuth(async (request, context) => {
  const data = await request.json();

  const userId = context.user.id;
  const { result, success, error } = await updatePoll(data, userId);

  if (!success) {
    return NextResponse.json({
      message: "Can't create poll.",
      error: JSON.stringify(
        error instanceof Error
          ? { name: error.name, message: error.message }
          : {},
      ),
    }, { status: 400 });
  }

  return NextResponse.json({ message: "Poll created.", result }, {
    status: 201,
  });
});

export const DELETE = withAuth(async (request, context) => {
  const userId = context.user.id;
  const { pollId } = await request.json();
  const { success, error, result } = await deleteUserPoll(pollId, userId);

  if (!success) {
    return NextResponse.json({
      message: "Couldn't delete the poll.",
      error: JSON.stringify(error),
    }, { status: 400 });
  }

  return NextResponse.json({ result });
});
