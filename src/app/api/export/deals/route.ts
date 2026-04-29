import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const where: any = {};
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const stage = searchParams.get("stage");

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }
    if (stage) where.stage = stage;

    const deals = await prisma.deal.findMany({ where });

    const csv = [
      ["Title", "Value", "Stage", "Probability", "Status", "Expected Close", "Created At"].join(","),
      ...deals.map((d) =>
        [d.title, d.value, d.stage, d.probability, d.status, d.expectedCloseDate ? new Date(d.expectedCloseDate).toLocaleDateString() : "", new Date(d.createdAt).toLocaleDateString()].map((field) => `"${field}"`).join(",")
      ),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="deals.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to export deals" }, { status: 500 });
  }
}
