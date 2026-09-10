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

  const res = await getUserPolls({ userId });

  if (!res.ok) {
    return NextResponse.json({
      error: res.error,
    }, { status: res.error.status });
  }

  return NextResponse.json({ result: res.data });
});

export const POST = withAuth(async (request, context) => {
  const data = await request.json();

  const userId = context.user.id;
  const res = await createPoll({ ...data, userId });

  if (!res.ok) {
    return NextResponse.json({
      error: res.error,
    }, { status: res.error.status });
  }

  return NextResponse.json({ result: res.data }, {
    status: 201,
  });
});

export const PUT = withAuth(async (request, context) => {
  const data = await request.json();

  const userId = context.user.id;
  const res = await updatePoll(data, userId);

  if (!res.ok) {
    return NextResponse.json({
      error: res.error,
    }, { status: res.error.status });
  }

  return NextResponse.json({ result: res.data }, {
    status: 201,
  });
});

export const DELETE = withAuth(async (request, context) => {
  const userId = context.user.id;
  const { pollId } = await request.json();
  const res = await deleteUserPoll(pollId, userId);

  if (!res.ok) {
    return NextResponse.json({
      error: res.error,
    }, { status: res.error.status });
  }

  return NextResponse.json({ result: res.data });
});
