import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { industry: { contains: search, mode: "insensitive" } },
      ];
    }

    const companies = await prisma.company.findMany({ where });

    const csv = [
      ["Name", "Industry", "Website", "Phone", "Email", "Address", "Created At"].join(","),
      ...companies.map((c) =>
        [c.name, c.industry || "", c.website || "", c.phone || "", c.email || "", c.address || "", new Date(c.createdAt).toLocaleDateString()].map((field) => `"${field}"`).join(",")
      ),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="companies.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to export companies" }, { status: 500 });
  }
}
