import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCompanySchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const industry = searchParams.get("industry");

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { industry: { contains: search, mode: "insensitive" } },
      ];
    }

    if (industry) {
      where.industry = industry;
    }

    const companies = await prisma.company.findMany({
      where,
      include: { contacts: true, deals: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createCompanySchema.parse(body);

    const company = await prisma.company.create({
      data: {
        name: validatedData.name,
        industry: validatedData.industry || null,
        website: validatedData.website || null,
        address: validatedData.address || null,
        phone: validatedData.phone || null,
        email: validatedData.email || null,
        notes: validatedData.notes || null,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    console.error("Error creating company:", error);
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}
