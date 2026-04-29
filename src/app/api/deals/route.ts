import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createDealSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const stage = searchParams.get("stage");

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }

    if (stage) {
      where.stage = stage;
    }

    const deals = await prisma.deal.findMany({
      where,
      include: { contact: true, company: true, user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createDealSchema.parse(body);

    const deal = await prisma.deal.create({
      data: {
        title: validatedData.title,
        value: validatedData.value,
        stage: validatedData.stage,
        probability: validatedData.probability,
        expectedCloseDate: validatedData.expectedCloseDate ? new Date(validatedData.expectedCloseDate) : null,
        status: validatedData.status,
        notes: validatedData.notes || null,
        contactId: validatedData.contactId || null,
        companyId: validatedData.companyId || null,
      },
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    console.error("Error creating deal:", error);
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 });
  }
}
