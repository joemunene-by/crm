import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createActivitySchema } from "@/lib/validations";

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
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createActivitySchema.parse(body);

    const activity = await prisma.activity.create({
      data: {
        type: validatedData.type,
        description: validatedData.description,
        date: validatedData.date ? new Date(validatedData.date) : new Date(),
        contactId: validatedData.contactId || null,
        dealId: validatedData.dealId || null,
        userId: validatedData.userId || null,
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    console.error("Error creating activity:", error);
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
  }
}
