import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const where = userId ? { userId } : {};

    const activities = await prisma.activity.findMany({
      where,
      include: { user: true, contact: true, deal: true },
      orderBy: { date: "desc" },
      take: 50,
    });

    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, description, date, contactId, dealId, userId } = body;

    const activity = await prisma.activity.create({
      data: {
        type,
        description,
        date: date ? new Date(date) : new Date(),
        contactId,
        dealId,
        userId,
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
  }
}
