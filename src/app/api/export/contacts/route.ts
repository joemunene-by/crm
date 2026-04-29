import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;

    const contacts = await prisma.contact.findMany({ where });

    const csv = [
      ["First Name", "Last Name", "Email", "Phone", "Company", "Position", "Status", "Source", "Created At"].join(","),
      ...contacts.map((c) =>
        [c.firstName, c.lastName, c.email || "", c.phone || "", c.company || "", c.position || "", c.status, c.source || "", new Date(c.createdAt).toLocaleDateString()].map((field) => `"${field}"`).join(",")
      ),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="contacts.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to export contacts" }, { status: 500 });
  }
}
